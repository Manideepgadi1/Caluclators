#!/bin/bash

# Simple Pull and Restart Script for VPS
# Use this script on your VPS to pull latest code and restart services
# Usage: ./pull-and-restart.sh

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo "Pulling Latest Code and Restarting"
echo "========================================="
echo ""

# Get current directory or use default
APP_DIR="${1:-/var/www/vsfintech/Investment-Calculator}"

# Check if directory exists
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}Error: Directory $APP_DIR does not exist${NC}"
    exit 1
fi

cd "$APP_DIR"

# Check if it's a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Stash any local changes (just in case)
echo -e "${YELLOW}→ Checking for local changes...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}→ Stashing local changes...${NC}"
    git stash
fi

# Pull latest code
echo -e "${YELLOW}→ Pulling latest code from GitHub...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to pull code${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Code updated${NC}"

# Rebuild frontend (Next.js)
echo ""
echo -e "${YELLOW}→ Building frontend (Next.js)...${NC}"
cd "$APP_DIR/frontend"
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

# Restart backend (uvicorn)
echo ""
echo -e "${YELLOW}→ Restarting backend (uvicorn)...${NC}"
pkill -f "uvicorn app.main:app" || true
cd "$APP_DIR/backend"
nohup venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 5003 > /dev/null 2>&1 &
echo -e "${GREEN}✓ Backend restarted${NC}"

# Restart frontend (Next.js)
echo -e "${YELLOW}→ Restarting frontend (Next.js)...${NC}"
pkill -f "next start" || true
cd "$APP_DIR/frontend"
nohup npm start > /dev/null 2>&1 &
echo -e "${GREEN}✓ Frontend restarted${NC}"

# Wait for services to start
sleep 3

# Show running processes
echo ""
echo -e "${GREEN}✓ Services status:${NC}"
ps aux | grep -E "uvicorn app.main:app|next start" | grep -v grep

echo ""
echo -e "${GREEN}========================================="
echo "✓ Update Complete!"
echo "=========================================${NC}"
echo ""
