#!/bin/bash

# Quick Update Script for Production
# Use this to quickly update your deployed application

set -e

echo "========================================="
echo "Updating Financial Calculators App"
echo "========================================="
echo ""

APP_DIR="/var/www/financial-calculators"
cd $APP_DIR

# Pull latest code
echo "→ Pulling latest code..."
git pull origin main

# Rebuild and restart containers
echo "→ Rebuilding containers..."
docker-compose down
docker-compose up -d --build

# Wait for containers to be healthy
echo "→ Waiting for containers to start..."
sleep 10

# Check status
echo ""
echo "→ Container status:"
docker-compose ps

# Show recent logs
echo ""
echo "→ Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✓ Update complete!"
echo "Check the app at: https://$(grep DOMAIN .env | cut -d'=' -f2)"
