#!/bin/bash

# Health Check Script
# Monitors the application health and sends alerts

APP_DIR="/var/www/financial-calculators"
cd $APP_DIR

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Financial Calculators - Health Check"
echo "========================================="
echo ""

# Check Docker containers
echo "→ Checking Docker containers..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Containers are running${NC}"
else
    echo -e "${RED}✗ Containers are NOT running${NC}"
    echo "Starting containers..."
    docker-compose up -d
fi

# Check backend
echo ""
echo "→ Checking Backend API..."
if curl -f -s http://localhost:8000/docs > /dev/null; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
else
    echo -e "${RED}✗ Backend is NOT responding${NC}"
fi

# Check frontend
echo ""
echo "→ Checking Frontend..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is responding${NC}"
else
    echo -e "${RED}✗ Frontend is NOT responding${NC}"
fi

# Check Nginx
echo ""
echo "→ Checking Nginx..."
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}✗ Nginx is NOT running${NC}"
fi

# Check SSL certificate expiry
echo ""
echo "→ Checking SSL certificate..."
if command -v certbot &> /dev/null; then
    CERT_EXPIRY=$(certbot certificates 2>/dev/null | grep "Expiry Date" | head -1 | cut -d: -f2-)
    if [ -n "$CERT_EXPIRY" ]; then
        echo -e "${GREEN}✓ SSL certificate valid until:${NC} $CERT_EXPIRY"
    else
        echo -e "${YELLOW}⚠ No SSL certificate found${NC}"
    fi
fi

# Check disk space
echo ""
echo "→ Checking Disk Space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ Disk usage: ${DISK_USAGE}%${NC}"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ Disk usage: ${DISK_USAGE}%${NC}"
else
    echo -e "${RED}✗ Disk usage critical: ${DISK_USAGE}%${NC}"
fi

# Check memory
echo ""
echo "→ Checking Memory..."
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ Memory usage: ${MEM_USAGE}%${NC}"
elif [ "$MEM_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ Memory usage: ${MEM_USAGE}%${NC}"
else
    echo -e "${RED}✗ Memory usage critical: ${MEM_USAGE}%${NC}"
fi

# Show recent errors from logs
echo ""
echo "→ Recent errors (last 10 lines):"
docker-compose logs --tail=10 | grep -i error || echo "No recent errors found"

echo ""
echo "========================================="
echo "Health check complete"
echo "========================================="
