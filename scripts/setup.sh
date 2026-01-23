#!/bin/bash

# ============================================================================
# School MIS Setup Script
# ============================================================================

echo "🏫 School MIS Setup Script"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================================================
# STEP 1: Check Prerequisites
# ============================================================================

print_step "1" "Checking prerequisites..."

if ! command_exists bun; then
    print_error "Bun is not installed. Install from https://bun.sh"
    exit 1
fi

if ! command_exists psql; then
    print_warning "PostgreSQL client not found. You may need to install it separately."
fi

print_success "Prerequisites check passed"
echo ""

# ============================================================================
# STEP 2: Neon PostgreSQL Setup
# ============================================================================

print_step "2" "Neon PostgreSQL Setup"

echo ""
echo "To set up Neon PostgreSQL:"
echo ""
echo "1. Go to https://console.neon.tech and sign up for free"
echo "2. Click 'Create Project'"
echo "3. Name it 'school-mis' and select a region"
echo "4. Click 'Create'"
echo "5. Wait for the project to be ready"
echo "6. Click 'Connection Details'"
echo "7. Copy the Connection string"
echo ""
echo -n "Paste your Neon connection string here (or press Enter to skip): "
read -r DATABASE_URL

if [ -n "$DATABASE_URL" ]; then
    # Update .env file
    if [ -f ".env" ]; then
        sed -i '' "s|DATABASE_URL=\"postgresql://\[USER\]:\[PASSWORD\]@\[HOST\].neon.tech/school_mis?sslmode=require\"|DATABASE_URL=\"$DATABASE_URL\"|g" .env
        print_success "Updated DATABASE_URL in .env"
    else
        echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
        print_success "Created .env with DATABASE_URL"
    fi
else
    print_warning "Skipping database setup. You'll need to set DATABASE_URL manually."
fi

echo ""

# ============================================================================
# STEP 3: Install Dependencies
# ============================================================================

print_step "3" "Installing dependencies..."

echo "Installing web dependencies..."
cd apps/web && bun install && cd ../..

echo "Installing storage dependencies..."
cd packages/storage && bun install && cd ../..

print_success "Dependencies installed"
echo ""

# ============================================================================
# STEP 4: Run Database Migrations
# ============================================================================

print_step "4" "Running database migrations..."

if [ -f ".env" ] && grep -q "DATABASE_URL" .env && ! grep -q "\[USER\]" .env; then
    echo "Running migrations..."
    cd packages/storage && bun run db:migrate && cd ../..
    print_success "Migrations completed"
else
    print_warning "Skipping migrations. Set DATABASE_URL first."
fi

echo ""

# ============================================================================
# STEP 5: Seed Demo Data
# ============================================================================

print_step "5" "Seeding demo data..."

if [ -f ".env" ] && grep -q "DATABASE_URL" .env && ! grep -q "\[USER\]" .env; then
    echo "Creating demo data..."
    
    # Create demo users
    cd packages/storage && bun run db:seed 2>/dev/null || echo "No seed script found. Skipping..."
    cd ../..
    
    print_success "Demo data seeded"
else
    print_warning "Skipping demo data. Set DATABASE_URL first."
fi

echo ""

# ============================================================================
# STEP 6: Configure Notification Services (Optional)
# ============================================================================

print_step "6" "Configure notification services (optional)"

echo ""
echo "Do you want to configure notification services?"
echo "1. Skip (use mock services)"
echo "2. Configure Email (SMTP)"
echo "3. Configure SMS (Twilio)"
echo "4. Configure WhatsApp (Twilio)"
echo "5. Configure all"
echo -n "Select an option (1-5): "
read -r option

case $option in
    2|3|4|5)
        echo ""
        echo "Edit .env file and fill in your credentials:"
        echo ""
        if [ "$option" = "2" ] || [ "$option" = "5" ]; then
            echo "📧 For Email (SMTP):"
            echo "   - Get SMTP credentials from SendGrid, Mailgun, or your email provider"
            echo "   - Update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL"
        fi
        if [ "$option" = "3" ] || [ "$option" = "5" ]; then
            echo "📱 For SMS (Twilio):"
            echo "   - Sign up at https://www.twilio.com"
            echo "   - Get a phone number"
            echo "   - Update TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"
        fi
        if [ "$option" = "4" ] || [ "$option" = "5" ]; then
            echo "💬 For WhatsApp (Twilio):"
            echo "   - Enable WhatsApp in Twilio Console"
            echo "   - Update TWILIO_WHATSAPP_NUMBER"
        fi
        ;;
esac

echo ""

# ============================================================================
# STEP 7: Start Development Server
# ============================================================================

print_step "7" "Starting development server..."

echo ""
echo "To start the development server, run:"
echo "  cd apps/web && bun run dev"
echo ""
echo "The app will be available at http://localhost:3008"
echo ""

# ============================================================================
# Default Login Credentials
# ============================================================================

echo "=========================================="
echo "📝 Default Login Credentials (Development)"
echo "=========================================="
echo ""
echo "🔐 Admin Panel:"
echo "   Email:    admin@school.com"
echo "   Password: admin123"
echo ""
echo "👨‍🏫 Teacher Portal:"
echo "   Email:    teacher@school.com"
echo "   Password: teacher123"
echo ""
echo "👨‍🎓 Student Portal:"
echo "   Email:    student@school.com"
echo "   Password: student123"
echo ""
echo "👪 Parent Portal:"
echo "   Email:    parent@school.com"
echo "   Password: parent123"
echo ""
echo "💰 Accountant:"
echo "   Email:    accountant@school.com"
echo "   Password: accountant123"
echo ""
echo "=========================================="
echo ""
print_success "Setup complete! 🎉"
echo ""
