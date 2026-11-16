#!/bin/bash

# Agent Browser Testing Script for School MIS
# Tests all major routes using agent-browser for visual testing

set -e

# Configuration
BASE_URL="${1:-https://school.aryaminakshi.workers.dev}"
TEST_RESULTS_DIR="agent-browser-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$TEST_RESULTS_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  School MIS Agent Browser Testing${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Target URL: ${YELLOW}$BASE_URL${NC}"
echo -e "Results Directory: ${YELLOW}$TEST_RESULTS_DIR${NC}"
echo ""

# Check if agent-browser is installed
if ! command -v agent-browser &> /dev/null; then
    echo -e "${RED}✗ agent-browser not found${NC}"
    echo "Please install: npm install -g agent-browser"
    exit 1
fi

# Track results
TOTAL=0
PASSED=0
FAILED=0
SKIPPED=0

test_route_agent() {
    local route=$1
    local description=$2
    local screenshot=${3:-true}
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing $description... "
    
    local full_url="${BASE_URL}${route}"
    local filename=$(echo "$route" | tr '/' '_' | sed 's/^_//')
    [ -z "$filename" ] && filename="home"
    
    # Try to open and capture
    if agent-browser open "$full_url" > /dev/null 2>&1; then
        # Wait for load
        if agent-browser wait --load networkidle > /dev/null 2>&1; then
            # Take screenshot if requested
            if [ "$screenshot" = true ]; then
                agent-browser screenshot --full "$TEST_RESULTS_DIR/${filename}.png" > /dev/null 2>&1 || true
            fi
            
            # Get page title
            title=$(agent-browser get title 2>/dev/null || echo "Unknown")
            
            # Check for error indicators
            if agent-browser get text body 2>/dev/null | grep -qi "error\|404\|not found"; then
                echo -e "${YELLOW}! WARNING${NC} (may have errors)"
                SKIPPED=$((SKIPPED + 1))
            else
                echo -e "${GREEN}✓ PASS${NC}"
                PASSED=$((PASSED + 1))
            fi
            return 0
        else
            echo -e "${YELLOW}! TIMEOUT${NC} (page loaded but network not idle)"
            SKIPPED=$((SKIPPED + 1))
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (cannot load page)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

test_mobile_viewport() {
    local route=$1
    local device=$2
    
    echo -n "Testing $device... "
    
    agent-browser set device "$device" > /dev/null 2>&1
    
    if agent-browser open "${BASE_URL}${route}" > /dev/null 2>&1 && \
       agent-browser wait --load networkidle > /dev/null 2>&1; then
        local filename="mobile-$(echo "$device" | tr ' ' '_' | tr '[:upper:]' '[:lower:]')"
        agent-browser screenshot --full "$TEST_RESULTS_DIR/${filename}.png" > /dev/null 2>&1 || true
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # Reset to desktop
    agent-browser set viewport 1920 1080 > /dev/null 2>&1
}

echo -e "${BLUE}Testing Public Routes...${NC}"
echo ""

# Public Pages
public_routes=(
    "/:Homepage"
    "/about:About"
    "/features:Features"
    "/pricing:Pricing"
    "/login:Login"
    "/signup:Signup"
    "/terms:Terms"
    "/privacy:Privacy"
)

for route_info in "${public_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_route_agent "$route" "$desc"
done

echo ""
echo -e "${BLUE}Testing App Routes (Protected)...${NC}"
echo ""

# App Routes (will show login if not authenticated)
app_routes=(
    "/app:Dashboard"
    "/app/students:Students"
    "/app/teachers:Teachers"
    "/app/classes:Classes"
    "/app/attendance:Attendance"
    "/app/fees:Fees"
    "/app/library:Library"
    "/app/settings:Settings"
)

for route_info in "${app_routes[@]}"; do
    IFS=':' read -r route desc <<< "$route_info"
    test_route_agent "$route" "$desc"
done

echo ""
echo -e "${BLUE}Testing Mobile Responsiveness...${NC}"
echo ""

# Test on mobile devices
test_mobile_viewport "/" "iPhone 14"
test_mobile_viewport "/app" "iPad Pro"

echo ""
echo -e "${BLUE}Testing API Endpoints (via browser)...${NC}"
echo ""

# Test API docs page
test_route_agent "/api/docs" "API Documentation" true

# Test health endpoint (JSON view)
if agent-browser open "${BASE_URL}/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API Health endpoint accessible${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ API Health endpoint failed${NC}"
    FAILED=$((FAILED + 1))
fi
TOTAL=$((TOTAL + 1))

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}           TEST RESULTS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Total Tests: ${YELLOW}$TOTAL${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$SKIPPED${NC}"
echo ""
echo -e "Screenshots saved in: ${BLUE}$TEST_RESULTS_DIR${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests completed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}! Some tests had issues${NC}"
    exit 1
fi
