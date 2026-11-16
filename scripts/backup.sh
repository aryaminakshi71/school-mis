#!/bin/bash
# School MIS Database Backup Automation
# Supports automated backups to S3, R2, or local storage

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
BACKUP_PREFIX="${BACKUP_PREFIX:-school-mis-backup}"

# Get database URL from environment or .env file
get_database_url() {
    if [ -n "$DATABASE_URL" ]; then
        echo "$DATABASE_URL"
    elif [ -f ".env" ]; then
        grep DATABASE_URL .env | head -1 | cut -d '=' -f2- | tr -d '"' | tr -d "'"
    else
        echo ""
    fi
}

# Create backup directory
setup() {
    mkdir -p "$BACKUP_DIR"
    
    DATABASE_URL=$(get_database_url)
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL not found${NC}"
        echo "Set DATABASE_URL environment variable or create .env file"
        exit 1
    fi
    
    export DATABASE_URL
}

# Create database backup
create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${BACKUP_PREFIX}_${timestamp}.sql"
    local compressed_file="${backup_file}.gz"
    
    echo -e "${BLUE}Creating backup: $backup_file${NC}"
    
    # Check if pg_dump is available
    if ! command -v pg_dump &> /dev/null; then
        echo -e "${RED}❌ pg_dump not found${NC}"
        echo "Install PostgreSQL client tools first"
        exit 1
    fi
    
    # Create backup
    echo -e "${YELLOW}Dumping database...${NC}"
    pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${backup_file}"
    
    # Compress backup
    echo -e "${YELLOW}Compressing backup...${NC}"
    gzip "${BACKUP_DIR}/${backup_file}"
    
    # Get file size
    local file_size=$(du -h "${BACKUP_DIR}/${compressed_file}" | cut -f1)
    
    echo -e "${GREEN}✅ Backup created: ${compressed_file} (${file_size})${NC}"
    
    # Upload to cloud storage if configured
    upload_to_cloud "${BACKUP_DIR}/${compressed_file}"
    
    echo "${BACKUP_DIR}/${compressed_file}"
}

# Upload to cloud storage
upload_to_cloud() {
    local file="$1"
    
    # Upload to S3 if configured
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$S3_BUCKET" ]; then
        echo -e "${YELLOW}Uploading to S3...${NC}"
        
        if command -v aws &> /dev/null; then
            aws s3 cp "$file" "s3://${S3_BUCKET}/backups/"
            echo -e "${GREEN}✅ Uploaded to S3${NC}"
        else
            echo -e "${RED}❌ AWS CLI not found${NC}"
        fi
    fi
    
    # Upload to Cloudflare R2 if configured
    if [ -n "$R2_ACCESS_KEY_ID" ] && [ -n "$R2_BUCKET" ]; then
        echo -e "${YELLOW}Uploading to R2...${NC}"
        
        if command -v wrangler &> /dev/null; then
            wrangler r2 object put "${R2_BUCKET}/backups/$(basename "$file")" --file="$file"
            echo -e "${GREEN}✅ Uploaded to R2${NC}"
        else
            echo -e "${RED}❌ Wrangler not found${NC}"
        fi
    fi
}

# Clean old backups
cleanup_old_backups() {
    echo -e "${BLUE}Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"
    
    local deleted=0
    
    # Clean local backups
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            rm "$file"
            echo -e "${YELLOW}Deleted: $(basename "$file")${NC}"
            ((deleted++))
        fi
    done < <(find "$BACKUP_DIR" -name "${BACKUP_PREFIX}_*.sql.gz" -type f -mtime +${RETENTION_DAYS} 2>/dev/null)
    
    echo -e "${GREEN}✅ Cleaned up ${deleted} old backups${NC}"
    
    # Clean S3 backups if configured
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$S3_BUCKET" ]; then
        echo -e "${YELLOW}Cleaning S3 backups...${NC}"
        
        local cutoff_date=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y-%m-%d)
        
        aws s3 ls "s3://${S3_BUCKET}/backups/" | while read -r line; do
            local file_date=$(echo "$line" | awk '{print $1}')
            local file_name=$(echo "$line" | awk '{print $4}')
            
            if [[ "$file_date" < "$cutoff_date" ]] && [[ "$file_name" == ${BACKUP_PREFIX}_* ]]; then
                aws s3 rm "s3://${S3_BUCKET}/backups/${file_name}"
                echo -e "${YELLOW}Deleted from S3: $file_name${NC}"
            fi
        done
    fi
}

# List available backups
list_backups() {
    echo -e "${BLUE}Available backups:${NC}"
    echo ""
    
    echo -e "${YELLOW}Local backups:${NC}"
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | awk '{print $9, "(" $5 ")", $6, $7, $8}' || echo "No local backups found"
    
    echo ""
    
    # List S3 backups if configured
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$S3_BUCKET" ]; then
        echo -e "${YELLOW}S3 backups:${NC}"
        aws s3 ls "s3://${S3_BUCKET}/backups/" | grep "${BACKUP_PREFIX}" | awk '{print $4, "(" $3 " bytes)", $1}' || echo "No S3 backups found"
        echo ""
    fi
}

# Restore from backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ Please specify backup file to restore${NC}"
        echo "Usage: $0 restore <backup-file>"
        list_backups
        exit 1
    fi
    
    # If file doesn't exist locally, try to download from S3
    if [ ! -f "$backup_file" ]; then
        if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$S3_BUCKET" ]; then
            echo -e "${YELLOW}Downloading from S3...${NC}"
            aws s3 cp "s3://${S3_BUCKET}/backups/${backup_file}" "${BACKUP_DIR}/${backup_file}"
            backup_file="${BACKUP_DIR}/${backup_file}"
        else
            echo -e "${RED}❌ Backup file not found: $backup_file${NC}"
            exit 1
        fi
    fi
    
    # Decompress if needed
    if [[ "$backup_file" == *.gz ]]; then
        echo -e "${YELLOW}Decompressing backup...${NC}"
        gunzip -k "$backup_file"
        backup_file="${backup_file%.gz}"
    fi
    
    echo -e "${RED}⚠️  WARNING: This will overwrite your current database${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}Restore cancelled${NC}"
        exit 0
    fi
    
    echo -e "${YELLOW}Restoring database...${NC}"
    
    # Create a temporary backup before restore
    echo -e "${BLUE}Creating safety backup before restore...${NC}"
    local safety_backup="${BACKUP_DIR}/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql"
    pg_dump "$DATABASE_URL" > "$safety_backup"
    echo -e "${GREEN}✅ Safety backup created: $safety_backup${NC}"
    
    # Restore database
    psql "$DATABASE_URL" < "$backup_file"
    
    echo -e "${GREEN}✅ Database restored successfully${NC}"
    
    # Cleanup
    if [[ "$1" == *.gz ]]; then
        rm "$backup_file"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}❌ Please specify backup file to verify${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Verifying backup: $backup_file${NC}"
    
    # Check if file exists
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}❌ Backup file not found${NC}"
        exit 1
    fi
    
    # Check if it's a valid gzip file
    if [[ "$backup_file" == *.gz ]]; then
        if gunzip -t "$backup_file" 2>/dev/null; then
            echo -e "${GREEN}✅ Backup file is valid (gzip)${NC}"
        else
            echo -e "${RED}❌ Backup file is corrupted (gzip)${NC}"
            exit 1
        fi
    fi
    
    # Check SQL syntax (basic check)
    if [[ "$backup_file" == *.sql ]]; then
        if head -1 "$backup_file" | grep -q "PostgreSQL database dump"; then
            echo -e "${GREEN}✅ Backup appears to be a valid PostgreSQL dump${NC}"
        else
            echo -e "${YELLOW}⚠️ Backup format unknown, but file exists${NC}"
        fi
    fi
    
    # Check file size
    local size=$(du -h "$backup_file" | cut -f1)
    echo -e "${BLUE}Backup size: $size${NC}"
}

# Main function
main() {
    local command="${1:-backup}"
    
    case "$command" in
        backup)
            setup
            create_backup
            cleanup_old_backups
            ;;
        list)
            list_backups
            ;;
        restore)
            setup
            restore_backup "$2"
            ;;
        verify)
            verify_backup "$2"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        help|--help|-h)
            echo "School MIS Database Backup Tool"
            echo ""
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  backup           Create a new backup (default)"
            echo "  list             List all available backups"
            echo "  restore <file>   Restore database from backup"
            echo "  verify <file>    Verify backup integrity"
            echo "  cleanup          Remove old backups"
            echo "  help             Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DATABASE_URL         PostgreSQL connection string"
            echo "  BACKUP_DIR           Local backup directory (default: ./backups)"
            echo "  RETENTION_DAYS       Days to keep backups (default: 30)"
            echo "  BACKUP_PREFIX        Backup file prefix (default: school-mis-backup)"
            echo "  AWS_ACCESS_KEY_ID    AWS credentials for S3"
            echo "  S3_BUCKET            S3 bucket name"
            echo "  R2_ACCESS_KEY_ID     R2 credentials"
            echo "  R2_BUCKET            R2 bucket name"
            echo ""
            echo "Examples:"
            echo "  $0                    # Create backup"
            echo "  $0 backup             # Create backup explicitly"
            echo "  $0 list               # List backups"
            echo "  $0 restore backup.sql.gz  # Restore from backup"
            ;;
        *)
            echo -e "${RED}Unknown command: $command${NC}"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"
