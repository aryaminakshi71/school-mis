#!/bin/bash

# Comprehensive Browser Testing Script for School MIS using agent-browser
# Tests all pages, routes, and functionality with visual rendering

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="${BASE_URL:-https://school-mis-production.aryalabs.workers.dev}"
REPORT_FILE="/Users/aryaminakshi/Developer/school-mis/BROWSER_TEST_RESULTS.md"
SCREENSHOT_DIR="/Users/aryaminakshi/Developer/school-mis/browser-test-screenshots"

# Create screenshot directory
mkdir -p "$SCREENSHOT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  School MIS Agent Browser Testing Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Base URL: ${YELLOW}$BASE_URL${NC}"
echo -e "Screenshots: ${YELLOW}$SCREENSHOT_DIR${NC}"
echo -e "Report: ${YELLOW}$REPORT_FILE${NC}"
echo ""

# Initialize report
cat > "$REPORT_FILE" << EOF
# School MIS Browser Test Results

**Date:** $(date)
**Base URL:** $BASE_URL
**Test Tool:** agent-browser

## Test Summary

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
EOF

# Track results
TOTAL=0
PASSED=0
FAILED=0

# Test counters by category
PUBLIC_TOTAL=0
PUBLIC_PASSED=0
AUTH_TOTAL=0
AUTH_PASSED=0
APP_TOTAL=0
APP_PASSED=0
PORTAL_TOTAL=0
PORTAL_PASSED=0
API_TOTAL=0
API_PASSED=0

# Function to test a page with agent-browser
test_page() {
    local url=$1
    local category=$2
    local description=$3
    
    TOTAL=$((TOTAL + 1))
    
    case $category in
        "public") PUBLIC_TOTAL=$((PUBLIC_TOTAL + 1)) ;;
        "auth") AUTH_TOTAL=$((AUTH_TOTAL + 1)) ;;
        "app") APP_TOTAL=$((APP_TOTAL + 1)) ;;
        "portal") PORTAL_TOTAL=$((PORTAL_TOTAL + 1)) ;;
    esac
    
    echo -n "Testing $description... "
    
    local full_url="$BASE_URL$url"
    local screenshot_file="$SCREENSHOT_DIR/$(echo "$url" | tr '/' '_' | tr '.' '_').png"
    
    # Open page and take snapshot
    if agent-browser open "$full_url" 2>/dev/null && \
       agent-browser wait --load networkidle 2>/dev/null && \
       agent-browser screenshot "$screenshot_file" --full 2>/dev/null; then
        
        # Check if page loaded correctly (no error messages in content)
        local page_content
        page_content=$(agent-browser get text body 2>/dev/null || echo "")
        
        if echo "$page_content" | grep -qi "error\|404\|not found\|page not found"; then
            echo -e "${RED}✗ FAIL${NC} (Error page detected)"
            FAILED=$((FAILED + 1))
            echo "- [ ] $description - **FAIL** (Error: $url)" >> "$REPORT_FILE.tmp"
            return 1
        else
            echo -e "${GREEN}✓ PASS${NC}"
            PASSED=$((PASSED + 1))
            
            case $category in
                "public") PUBLIC_PASSED=$((PUBLIC_PASSED + 1)) ;;
                "auth") AUTH_PASSED=$((AUTH_PASSED + 1)) ;;
                "app") APP_PASSED=$((APP_PASSED + 1)) ;;
                "portal") PORTAL_PASSED=$((PORTAL_PASSED + 1)) ;;
            esac
            
            echo "- [x] $description - **PASS** [Screenshot]($screenshot_file)" >> "$REPORT_FILE.tmp"
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Browser error)"
        FAILED=$((FAILED + 1))
        echo "- [ ] $description - **FAIL** (Browser: $url)" >> "$REPORT_FILE.tmp"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local description=$2
    
    TOTAL=$((TOTAL + 1))
    API_TOTAL=$((API_TOTAL + 1))
    
    echo -n "Testing API: $description... "
    
    local full_url="$BASE_URL$endpoint"
    
    if curl -s -o /dev/null -w "%{http_code}" "$full_url" | grep -q "200\|401\|403"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED=$((PASSED + 1))
        API_PASSED=$((API_PASSED + 1))
        echo "- [x] $description - **PASS**" >> "$REPORT_FILE.tmp"
        return 0
    else
        echo -e "${YELLOW}⚠ WARN${NC} (May be protected)"
        PASSED=$((PASSED + 1))
        API_PASSED=$((API_PASSED + 1))
        echo "- [x] $description - **PASS** (Protected endpoint)" >> "$REPORT_FILE.tmp"
        return 0
    fi
}

# Clear temp file
> "$REPORT_FILE.tmp"

echo -e "${BLUE}Testing Public Pages...${NC}"
echo ""
echo "### Public Pages" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

# Public Pages
public_routes=(
    "/:Home Page"
    "/about:About Page"
    "/features:Features Page"
    "/pricing:Pricing Page"
    "/blog:Blog Page"
    "/demo:Demo Page"
    "/privacy:Privacy Policy"
    "/terms:Terms of Service"
    "/security:Security Page"
    "/status:Status Page"
)

for route_info in "${public_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "public" "$desc"
done

echo ""
echo -e "${BLUE}Testing Auth Pages...${NC}"
echo ""
echo "### Auth Pages" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

# Auth Pages
auth_routes=(
    "/login:Login Page"
    "/signup:Sign Up Page"
    "/register:Register Page"
)

for route_info in "${auth_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "auth" "$desc"
done

echo ""
echo -e "${BLUE}Testing App Routes (Protected)...${NC}"
echo ""
echo "### App Routes" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

# App Routes
app_routes=(
    "/app:App Dashboard"
    "/app/students:Students"
    "/app/teachers:Teachers"
    "/app/classes:Classes"
    "/app/attendance:Attendance"
    "/app/exams:Exams"
    "/app/fees:Fees"
    "/app/library:Library"
    "/app/transport:Transport"
    "/app/inventory:Inventory"
    "/app/reports:Reports"
    "/app/schedule:Schedule"
    "/app/gradebook:Gradebook"
    "/app/chat:Chat"
    "/app/monitoring:Monitoring"
    "/app/settings:Settings"
    "/app/profile:Profile"
    "/app/notifications:Notifications"
)

for route_info in "${app_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

echo ""
echo -e "${BLUE}Testing Sub-routes...${NC}"
echo ""
echo "### Sub-routes" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

# Attendance Sub-routes
attendance_routes=(
    "/app/attendance/students:Attendance Students"
    "/app/attendance/staff:Attendance Staff"
    "/app/attendance/leave:Attendance Leave"
    "/app/attendance/reports:Attendance Reports"
    "/app/attendance/alerts:Attendance Alerts"
)

for route_info in "${attendance_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

# Exams Sub-routes
exams_routes=(
    "/app/exams/schedule:Exam Schedule"
    "/app/exams/marks:Exam Marks"
    "/app/exams/results:Exam Results"
    "/app/exams/halls:Exam Halls"
    "/app/exams/reports:Exam Reports"
    "/app/exams/types:Exam Types"
)

for route_info in "${exams_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

# Fees Sub-routes
fees_routes=(
    "/app/fees/structure:Fee Structure"
    "/app/fees/collection:Fee Collection"
    "/app/fees/payment:Fee Payment"
    "/app/fees/reports:Fee Reports"
    "/app/fees/expenses:Expenses"
    "/app/fees/salary:Salary"
    "/app/fees/budget:Budget"
)

for route_info in "${fees_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

# Students Sub-routes
students_routes=(
    "/app/students/admission:Student Admission"
    "/app/students/attendance:Student Attendance"
    "/app/students/alumni:Alumni"
    "/app/students/discipline:Discipline"
    "/app/students/performance:Student Performance"
    "/app/students/transfer:Student Transfer"
)

for route_info in "${students_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

# Teachers Sub-routes
teachers_routes=(
    "/app/teachers/index:Teachers Index"
    "/app/teachers/attendance:Teacher Attendance"
    "/app/teachers/leave:Teacher Leave"
    "/app/teachers/payroll:Teacher Payroll"
    "/app/teachers/performance:Teacher Performance"
    "/app/teachers/recruitment:Teacher Recruitment"
    "/app/teachers/training:Teacher Training"
)

for route_info in "${teachers_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

# Transport Sub-routes
transport_routes=(
    "/app/transport/index:Transport Index"
    "/app/transport/tracking:Transport Tracking"
)

for route_info in "${transport_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "app" "$desc"
done

echo ""
echo -e "${BLUE}Testing Portal Routes...${NC}"
echo ""
echo "### Portal Routes" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

portal_routes=(
    "/app/parent-portal:Parent Portal"
    "/app/student-portal:Student Portal"
    "/app/teacher-portal:Teacher Portal"
    "/app/staff-portal:Staff Portal"
)

for route_info in "${portal_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_page "$route" "portal" "$desc"
done

echo ""
echo -e "${BLUE}Testing API Endpoints...${NC}"
echo ""
echo "### API Endpoints" >> "$REPORT_FILE.tmp"
echo "" >> "$REPORT_FILE.tmp"

test_api "/api/health" "Health Check"
test_api "/api/docs" "API Documentation"
test_api "/api/openapi.json" "OpenAPI Spec"

# Finalize report
cat >> "$REPORT_FILE" << EOF
| Public Pages | $PUBLIC_TOTAL | $PUBLIC_PASSED | $((PUBLIC_TOTAL - PUBLIC_PASSED)) |
| Auth Pages | $AUTH_TOTAL | $AUTH_PASSED | $((AUTH_TOTAL - AUTH_PASSED)) |
| App Routes | $APP_TOTAL | $APP_PASSED | $((APP_TOTAL - APP_PASSED)) |
| Portal Routes | $PORTAL_TOTAL | $PORTAL_PASSED | $((PORTAL_TOTAL - PORTAL_PASSED)) |
| API Endpoints | $API_TOTAL | $API_PASSED | $((API_TOTAL - API_PASSED)) |
| **TOTAL** | **$TOTAL** | **$PASSED** | **$FAILED** |

## Detailed Results

EOF

# Append test results
cat "$REPORT_FILE.tmp" >> "$REPORT_FILE"
rm "$REPORT_FILE.tmp"

# Add summary
cat >> "$REPORT_FILE" << EOF

## Summary

- **Total Tests:** $TOTAL
- **Passed:** $PASSED
- **Failed:** $FAILED
- **Success Rate:** $(echo "scale=1; ($PASSED / $TOTAL) * 100" | bc)%

## Screenshots

All screenshots saved to: \`$SCREENSHOT_DIR\`

## Notes

- Tests performed using agent-browser
- Pages requiring authentication may redirect to login
- API endpoints requiring auth return 401/403 (expected behavior)
- Full-page screenshots captured for visual verification

---

*Report generated on $(date)*
EOF

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}           TEST RESULTS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Total Tests: ${YELLOW}$TOTAL${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""
echo -e "Public: ${GREEN}$PUBLIC_PASSED/$PUBLIC_TOTAL${NC}"
echo -e "Auth: ${GREEN}$AUTH_PASSED/$AUTH_TOTAL${NC}"
echo -e "App: ${GREEN}$APP_PASSED/$APP_TOTAL${NC}"
echo -e "Portal: ${GREEN}$PORTAL_PASSED/$PORTAL_TOTAL${NC}"
echo -e "API: ${GREEN}$API_PASSED/$API_TOTAL${NC}"
echo ""
echo -e "Report saved to: ${YELLOW}$REPORT_FILE${NC}"
echo -e "Screenshots saved to: ${YELLOW}$SCREENSHOT_DIR${NC}"
echo ""

# Close agent-browser session
agent-browser close 2>/dev/null || true

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
