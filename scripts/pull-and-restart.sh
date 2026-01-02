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
echo -e "${YELLOW}→ Rebuilding frontend (Next.js)...${NC}"
cd "$APP_DIR/frontend"
rm -rf .next
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"

# Stop old processes
echo ""
echo -e "${YELLOW}→ Stopping old processes...${NC}"
pm2 stop investment-calculator-backend investment-calculator-frontend 2>/dev/null || true
pm2 delete investment-calculator-backend investment-calculator-frontend 2>/dev/null || true
echo -e "${GREEN}✓ Old processes stopped${NC}"

# Start backend with PM2
echo -e "${YELLOW}→ Starting backend (uvicorn)...${NC}"
cd "$APP_DIR/backend"
pm2 start "venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 5003" --name investment-calculator-backend
echo -e "${GREEN}✓ Backend started${NC}"

# Start frontend with PM2
echo -e "${YELLOW}→ Starting frontend (Next.js)...${NC}"
cd "$APP_DIR/frontend"
pm2 start npm --name investment-calculator-frontend -- start
echo -e "${GREEN}✓ Frontend started${NC}"

# Save PM2 configuration
echo -e "${YELLOW}→ Saving PM2 configuration...${NC}"
pm2 save
echo -e "${GREEN}✓ PM2 configuration saved${NC}"

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
