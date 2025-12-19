#!/bin/bash

# Redirect Chain Testing Script
# Tests common URLs for redirect chains after deployment
# Usage: ./test-redirect-chains.sh [domain]
# Example: ./test-redirect-chains.sh www.vapourism.co.uk

set -e

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install curl to use this script."
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain configuration - can be overridden via command line argument
DOMAIN="${1:-www.vapourism.co.uk}"
NON_WWW_DOMAIN=$(echo "$DOMAIN" | sed 's/^www\.//')

echo "========================================"
echo "Redirect Chain Testing Tool"
echo "Testing: $DOMAIN"
echo "========================================"
echo ""

# Function to count redirects and get details
analyze_redirects() {
    local url=$1
    local max_redirects=10
    
    # Capture full curl output including headers and timing
    local curl_output=$(curl -sI -L -w "\nFINAL_STATUS:%{http_code}\nREDIRECT_COUNT:%{num_redirects}\n" --max-redirs $max_redirects "$url" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        echo "ERROR|0|curl command failed with exit code $exit_code"
        return 1
    fi
    
    # Parse the output
    local redirect_count=$(echo "$curl_output" | grep "REDIRECT_COUNT:" | cut -d':' -f2)
    local final_status=$(echo "$curl_output" | grep "FINAL_STATUS:" | cut -d':' -f2)
    local locations=$(echo "$curl_output" | grep -i "^location:" | awk '{print $2}' | tr -d '\r' | paste -sd "|" -)
    
    echo "$redirect_count|$final_status|$locations"
    return 0
}

# Function to test a URL
test_url() {
    local url=$1
    local expected_redirects=$2
    local description=$3
    
    echo "Testing: $description"
    echo "URL: $url"
    
    # Analyze redirects
    local result=$(analyze_redirects "$url")
    local exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        echo -e "${RED}✗ FAIL${NC} (curl error)"
        echo ""
        return 1
    fi
    
    local count=$(echo "$result" | cut -d'|' -f1)
    local status=$(echo "$result" | cut -d'|' -f2)
    local locations=$(echo "$result" | cut -d'|' -f3)
    
    echo "Redirects: $count"
    echo "Final Status: $status"
    
    if [ ! -z "$locations" ] && [ "$locations" != " " ]; then
        echo "Redirect Chain:"
        echo "$locations" | tr '|' '\n' | while read -r loc; do
            [ ! -z "$loc" ] && echo "  → $loc"
        done
    fi
    
    # Check if redirect count is acceptable
    if [ "$count" -le "$expected_redirects" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Expected ≤$expected_redirects, got $count)"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected ≤$expected_redirects, got $count)"
    fi
    
    echo ""
}

# Test 1: track-order with www (should be 1 redirect)
test_url "https://$DOMAIN/track-order" 1 "Track Order (www)"

# Test 2: track-order without www (should be 2 redirects: www + /account/orders)
test_url "https://$NON_WWW_DOMAIN/track-order" 2 "Track Order (non-www)"

# Test 3: Normalized URL (should be 0-1 redirects)
test_url "https://$DOMAIN/products/test" 1 "Product Page (normalized)"

# Test 4: URL with uppercase hex encoding (should be 1 redirect)
test_url "https://$DOMAIN/products/test%2FPath" 2 "Product Page (needs normalization)"

# Test 5: Homepage
test_url "https://$DOMAIN/" 0 "Homepage"

# Test 6: Collection page
test_url "https://$DOMAIN/collections/all" 1 "Collections Page"

echo "========================================"
echo "Testing Complete!"
echo "========================================"
echo ""
echo "Summary:"
echo "- Track order redirect should have ≤1 redirect (www) or ≤2 (non-www)"
echo "- Other pages should have ≤1 redirect"
echo "- Final status should be 200 (or 302 for login-required pages)"
echo ""
echo "Usage: $0 [domain]"
echo "Example: $0 staging.vapourism.co.uk"
echo ""
echo "If any tests failed, investigate the redirect chain."
echo "See docs/seo/REDIRECT_CHAIN_FIX.md for details."
