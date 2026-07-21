#!/bin/bash
# Yarn Version Update Script
# Usage: ./scripts/update-yarn.sh 4.15.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Version not specified${NC}"
    echo ""
    echo "Usage: $0 <VERSION>"
    echo "Example: $0 4.15.0"
    echo ""
    echo "Latest Yarn versions can be found at:"
    echo "  https://github.com/yarnpkg/yarn/releases"
    exit 1
fi

NEW_VERSION="$1"
PACKAGE_JSON="package.json"
YARNRC_FILE=".yarnrc.yml"

# Validate version format
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    echo -e "${RED}Error: Invalid version format: $NEW_VERSION${NC}"
    echo "Expected format: X.Y.Z (e.g., 4.15.0)"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').packageManager.replace('yarn@', '')")

echo -e "${YELLOW}Yarn Version Update${NC}"
echo "===================="
echo "Current version: ${GREEN}$CURRENT_VERSION${NC}"
echo "New version:     ${GREEN}$NEW_VERSION${NC}"
echo ""

# Check if version is the same
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo -e "${YELLOW}Version is already set to $NEW_VERSION${NC}"
    exit 0
fi

# Check if Corepack is available
if ! command -v corepack &> /dev/null; then
    echo -e "${RED}Error: Corepack not found. Please run: npm install -g corepack${NC}"
    exit 1
fi

# Step 1: Update package.json
echo -e "${GREEN}Step 1: Updating package.json...${NC}"
if npm pkg set packageManager="yarn@${NEW_VERSION}"; then
    echo -e "${GREEN}✓ package.json updated${NC}"
else
    echo -e "${RED}✗ Failed to update package.json${NC}"
    exit 1
fi

# Step 2: Prepare and activate with Corepack
echo -e "${GREEN}Step 2: Preparing Yarn ${NEW_VERSION} with Corepack...${NC}"
if corepack prepare "yarn@${NEW_VERSION}" --activate; then
    echo -e "${GREEN}✓ Yarn ${NEW_VERSION} activated${NC}"
else
    echo -e "${RED}✗ Failed to prepare/activate Yarn${NC}"
    exit 1
fi

# Step 3: Update yarn.lock file
echo -e "${GREEN}Step 3: Updating yarn.lock file...${NC}"
if yarn install; then
    echo -e "${GREEN}✓ yarn.lock updated${NC}"
else
    echo -e "${RED}✗ Failed to run yarn install${NC}"
    exit 1
fi

# Step 4: Verify the update
echo -e "${GREEN}Step 4: Verifying installation...${NC}"
ACTIVE_VERSION=$(yarn --version)
echo -e "Active Yarn version: ${GREEN}$ACTIVE_VERSION${NC}"

# Verify package.json was updated
CONFIGURED_VERSION=$(node -p "require('./package.json').packageManager.replace('yarn@', '')")
if [ "$CONFIGURED_VERSION" != "$NEW_VERSION" ]; then
    echo -e "${RED}✗ Configured version mismatch!${NC}"
    exit 1
fi

# Show what changed
echo ""
echo -e "${GREEN}Changes made:${NC}"
echo "  package.json: yarn@${CURRENT_VERSION} → yarn@${NEW_VERSION}"

if grep -q "yarn-${NEW_VERSION}.cjs" "$YARNRC_FILE" 2>/dev/null; then
    echo "  .yarnrc.yml: Updated yarnPath"
    echo "  .yarn/releases/: New binary cached"
else
    echo -e "${YELLOW}  Note: .yarnrc.yml will be updated after next yarn command${NC}"
fi

echo ""
echo -e "${GREEN}✓ Yarn successfully upgraded to ${NEW_VERSION}${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify everything works: yarn lint"
echo "2. Commit changes: git add package.json yarn.lock .yarnrc.yml .yarn/releases/yarn-${NEW_VERSION}.cjs"
echo "3. Push to repository"
echo ""
echo "Files to commit:"
git status --short package.json yarn.lock .yarnrc.yml .yarn/releases/ 2>/dev/null | grep -E '^\s*M|^\s*\??' || echo "  (Run git status to see changes)"

