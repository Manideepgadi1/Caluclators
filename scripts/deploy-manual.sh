#!/bin/bash

# Manual Deployment Script (No Docker)
echo "========================================="
echo "Deploying Financial Calculators"
echo "========================================="

cd /var/www/financial-calculators

# Update code
echo "→ Pulling latest code..."
git pull origin main

# Setup Backend
echo "→ Setting up Backend..."
cd backend

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Kill old backend process if running
pkill -f "uvicorn app.main:app"

# Start backend in background
echo "→ Starting Backend on port 8000..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /var/log/backend.log 2>&1 &

# Setup Frontend
echo "→ Setting up Frontend..."
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Kill old frontend process if running
pkill -f "next start"

# Start frontend in background
echo "→ Starting Frontend on port 3000..."
nohup npm start > /var/log/frontend.log 2>&1 &

echo ""
echo "========================================="
echo "✓ Deployment Complete!"
echo "========================================="
echo ""
echo "Backend: http://82.25.105.18:8000"
echo "Frontend: http://82.25.105.18:3000"
echo ""
echo "View logs:"
echo "  Backend:  tail -f /var/log/backend.log"
echo "  Frontend: tail -f /var/log/frontend.log"
