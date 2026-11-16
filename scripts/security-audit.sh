#!/bin/bash
# Security Audit Script for School MIS
# Runs automated security scans and checks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔒 Running Security Audit for School MIS${NC}"
echo ""

# Track issues
ISSUES_FOUND=0
WARNINGS_FOUND=0

# Check for secrets in code
check_secrets() {
    echo -e "${BLUE}Checking for secrets in code...${NC}"
    
    # Patterns to check
    local patterns=(
        "password.*=.*['\"][^'\"]+['\"]"
        "api_key.*=.*['\"][^'\"]+['\"]"
        "secret.*=.*['\"][^'\"]+['\"]"
        "token.*=.*['\"][^'\"]{20,}['\"]"
        "DATABASE_URL.*postgresql://[^:]+:[^@]+@"
    )
    
    local found_secrets=0
    
    for pattern in "${patterns[@]}"; do
        if grep -r "$pattern" --include="*.ts" --include="*.js" --include="*.json" . 2>/dev/null | grep -v "node_modules" | grep -v "__tests__" | grep -v ".env.example" | head -5; then
            found_secrets=$((found_secrets + 1))
        fi
    done
    
    if [ $found_secrets -gt 0 ]; then
        echo -e "${RED}⚠️  Found potential secrets in code${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${GREEN}✅ No obvious secrets found in code${NC}"
    fi
    
    echo ""
}

# Check .env files
check_env_files() {
    echo -e "${BLUE}Checking .env files...${NC}"
    
    # Check if .env is committed
    if git ls-files | grep -q "^\.env$"; then
        echo -e "${RED}❌ .env file is committed to git${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${GREEN}✅ .env file is not in git${NC}"
    fi
    
    # Check .env.example exists
    if [ ! -f ".env.example" ]; then
        echo -e "${RED}❌ .env.example is missing${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo -e "${GREEN}✅ .env.example exists${NC}"
    fi
    
    echo ""
}

# Check dependencies for vulnerabilities
check_dependencies() {
    echo -e "${BLUE}Checking dependencies for vulnerabilities...${NC}"
    
    # Check if bun audit is available
    if command -v bun &> /dev/null; then
        if bun audit 2>/dev/null | grep -q "Found"; then
            echo -e "${YELLOW}⚠️  Found dependency vulnerabilities${NC}"
            WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
        else
            echo -e "${GREEN}✅ No known dependency vulnerabilities${NC}"
        fi
    fi
    
    echo ""
}

# Check for security headers
check_security_headers() {
    echo -e "${BLUE}Checking security headers in API...${NC}"
    
    # Check if security headers are set
    if grep -r "setSecurityHeaders\|X-Frame-Options\|X-Content-Type-Options" apps/api/src --include="*.ts" > /dev/null; then
        echo -e "${GREEN}✅ Security headers are configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Security headers may not be fully configured${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check for rate limiting
check_rate_limiting() {
    echo -e "${BLUE}Checking rate limiting...${NC}"
    
    if grep -r "rateLimit\|RateLimit" apps/api/src --include="*.ts" > /dev/null; then
        echo -e "${GREEN}✅ Rate limiting is configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Rate limiting may not be fully configured${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check for SQL injection prevention
check_sql_injection() {
    echo -e "${BLUE}Checking SQL injection prevention...${NC}"
    
    # Check if using parameterized queries
    local raw_sql_count=$(grep -r "\.raw\|\.query(" apps/api/src --include="*.ts" | grep -v "test" | wc -l)
    local orm_count=$(grep -r "drizzle-orm\|eq(" apps/api/src --include="*.ts" | wc -l)
    
    if [ $orm_count -gt 0 ]; then
        echo -e "${GREEN}✅ Using ORM (Drizzle) - SQL injection protection${NC}"
    else
        echo -e "${YELLOW}⚠️  ORM usage not detected${NC}"
    fi
    
    if [ $raw_sql_count -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Raw SQL queries found - review for injection risks${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check authentication implementation
check_authentication() {
    echo -e "${BLUE}Checking authentication implementation...${NC}"
    
    if grep -r "better-auth\|requireAuth\|requireRole" apps/api/src --include="*.ts" > /dev/null; then
        echo -e "${GREEN}✅ Authentication middleware is implemented${NC}"
    else
        echo -e "${YELLOW}⚠️  Authentication middleware may need review${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check audit logging
check_audit_logging() {
    echo -e "${BLUE}Checking audit logging...${NC}"
    
    if grep -r "auditLogMiddleware\|auditLogs" apps/api/src --include="*.ts" > /dev/null; then
        echo -e "${GREEN}✅ Audit logging is implemented${NC}"
    else
        echo -e "${YELLOW}⚠️  Audit logging may need review${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check CORS configuration
check_cors() {
    echo -e "${BLUE}Checking CORS configuration...${NC}"
    
    if grep -r "cors(" apps/api/src --include="*.ts" > /dev/null; then
        echo -e "${GREEN}✅ CORS is configured${NC}"
    else
        echo -e "${YELLOW}⚠️  CORS may not be configured${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check for HTTPS enforcement
check_https() {
    echo -e "${BLUE}Checking HTTPS configuration...${NC}"
    
    if grep -r "useSecureCookies\|https://" apps/api/src --include="*.ts" | grep -v "http://localhost" > /dev/null; then
        echo -e "${GREEN}✅ HTTPS is configured${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTPS configuration may need review${NC}"
        WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
    fi
    
    echo ""
}

# Check file permissions
check_file_permissions() {
    echo -e "${BLUE}Checking file permissions...${NC}"
    
    # Check for executable scripts
    local exec_count=$(find scripts -type f -executable 2>/dev/null | wc -l)
    if [ $exec_count -gt 0 ]; then
        echo -e "${GREEN}✅ Script permissions are set${NC}"
    fi
    
    echo ""
}

# Generate security report
generate_report() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}  Security Audit Summary${NC}"
    echo -e "${BLUE}=================================${NC}"
    echo ""
    echo -e "Issues Found: ${RED}$ISSUES_FOUND${NC}"
    echo -e "Warnings: ${YELLOW}$WARNINGS_FOUND${NC}"
    echo ""
    
    if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
        echo -e "${GREEN}✅ All security checks passed!${NC}"
        exit 0
    elif [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Some warnings found - review recommended${NC}"
        exit 0
    else
        echo -e "${RED}❌ Critical issues found - action required${NC}"
        exit 1
    fi
}

# Main
main() {
    check_secrets
    check_env_files
    check_dependencies
    check_security_headers
    check_rate_limiting
    check_sql_injection
    check_authentication
    check_audit_logging
    check_cors
    check_https
    check_file_permissions
    generate_report
}

main "$@"
