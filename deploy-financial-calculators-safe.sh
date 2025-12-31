#!/bin/bash

# Financial Calculators SAFE Deployment Script
# Next.js Frontend + FastAPI Backend
# Frontend: /investment-calculator/ | Backend Port: 5003 | API: /api/investment-calculator/
# Server: 82.25.105.18

set -e  # Exit on error

echo "🚀 Financial Calculators SAFE Deployment"
echo "=========================================="
echo ""

# Configuration
APP_NAME="investment-calculator"
BACKEND_NAME="investment-calculator-backend"
APP_DIR="/var/www/vsfintech/Investment-Calculator"
BACKEND_PORT=5003
PYTHON_VERSION="python3"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Clone from GitHub if directory doesn't exist
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}📥 Cloning Financial Calculators from GitHub...${NC}"
    cd /var/www/vsfintech
    git clone https://github.com/Manideepgadi1/Caluclators.git Investment-Calculator
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to clone from GitHub${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Repository cloned successfully${NC}"
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check for Next.js frontend
IS_NEXTJS=false
if [ -f "$APP_DIR/frontend/package.json" ]; then
    IS_NEXTJS=true
    echo -e "${GREEN}✓ Next.js application detected${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js first${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"
else
    echo -e "${RED}❌ Frontend not found${NC}"
    exit 1
fi

# Check if FastAPI backend exists
HAS_BACKEND=false
if [ -d "$APP_DIR/backend" ] && [ -f "$APP_DIR/backend/app/main.py" ]; then
    HAS_BACKEND=true
    echo -e "${GREEN}✓ FastAPI Backend found${NC}"
    
    # Check Python
    if ! command -v $PYTHON_VERSION &> /dev/null; then
        echo -e "${RED}❌ Python3 not found. Please install Python3 first${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python: $($PYTHON_VERSION --version)${NC}"
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}❌ PM2 not found. Please install PM2 first${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${YELLOW}ℹ️  No backend found${NC}"
fi

echo ""

# ========================================
# Deploy Backend (FastAPI)
# ========================================
if [ "$HAS_BACKEND" = true ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📦 Step 1: Deploying Backend (FastAPI)...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    cd "$APP_DIR/backend"

    # Remove old venv if exists
    if [ -d "venv" ]; then
        echo "Removing old virtual environment..."
        rm -rf venv
    fi

    # Create virtual environment
    echo "Creating Python virtual environment..."
    $PYTHON_VERSION -m venv venv
    source venv/bin/activate

    # Install dependencies
    echo "Installing Python dependencies..."
    if [ -f "requirements.txt" ]; then
        pip install --upgrade pip -q
        pip install -r requirements.txt -q
    else
        echo -e "${RED}❌ requirements.txt not found${NC}"
        exit 1
    fi

    deactivate
    echo -e "${GREEN}✓ Python dependencies installed${NC}"

    # Check port availability
    if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $BACKEND_PORT is in use${NC}"
        echo "Stopping existing process on port $BACKEND_PORT..."
        pm2 stop $BACKEND_NAME 2>/dev/null || true
        pm2 delete $BACKEND_NAME 2>/dev/null || true
        sleep 2
    fi

    # Start FastAPI backend with PM2
    echo "Starting FastAPI backend on port $BACKEND_PORT..."
    pm2 start "$APP_DIR/backend/venv/bin/uvicorn" \
        --name "$BACKEND_NAME" \
        --cwd "$APP_DIR/backend" \
        --interpreter none \
        -- app.main:app --host 0.0.0.0 --port $BACKEND_PORT

    pm2 save

    echo -e "${GREEN}✅ Backend deployed on port $BACKEND_PORT${NC}"
    echo ""
fi

# ========================================
# Deploy Frontend (Next.js)
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 Step 2: Deploying Frontend (Next.js)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$APP_DIR/frontend"

# Install npm dependencies
echo "Installing npm dependencies..."
npm install -q

# Configure Next.js for subpath deployment
echo "Configuring Next.js for /investment-calculator subpath..."

# Backup next.config.js
if [ -f "next.config.js" ]; then
    cp next.config.js "next.config.js.backup.$(date +%s)"
fi

# Update next.config.js to add basePath
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/investment-calculator',
  assetPrefix: '/investment-calculator',
  trailingSlash: true,
}

module.exports = nextConfig
EOF

echo -e "${GREEN}✓ Next.js config updated${NC}"

# Create .env.production file
if [ "$HAS_BACKEND" = true ]; then
    cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=/api/investment-calculator
EOF
    echo -e "${GREEN}✓ Environment file created${NC}"
fi

# Build Next.js
echo "Building Next.js application..."
npm run build

if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build failed - .next folder not created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Stop existing Next.js process if running
pm2 stop investment-calculator-frontend 2>/dev/null || true
pm2 delete investment-calculator-frontend 2>/dev/null || true

# Start Next.js with PM2
echo "Starting Next.js with PM2..."
pm2 start npm \
    --name "investment-calculator-frontend" \
    --cwd "$APP_DIR/frontend" \
    -- start

pm2 save

FRONTEND_PATH="$APP_DIR/frontend/.next"
echo ""

# ========================================
# Configure Nginx (SAFE - Append Only)
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🌐 Step 3: Configuring Nginx (SAFE MODE)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

NGINX_CONFIG="/etc/nginx/sites-available/default"

# Backup existing config
echo "Creating backup of nginx config..."
cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup.$(date +%s)"
echo -e "${GREEN}✓ Backup created${NC}"

# Create temporary config snippet
cat > /tmp/investment-calculator-nginx.conf << 'EOF'

    # =====================================================
    # FINANCIAL CALCULATORS - Investment Planning Tool
    # =====================================================
    # Financial Calculators Backend API
    location /api/investment-calculator/ {
        proxy_pass http://127.0.0.1:5003/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Prefix /investment-calculator;
    }

    # Financial Calculators Frontend (Next.js)
    location /investment-calculator/ {
        proxy_pass http://127.0.0.1:3000/investment-calculator/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /investment-calculator {
        return 301 /investment-calculator/;
    }
EOF

# Check if Financial Calculators config already exists
if grep -q "FINANCIAL CALCULATORS" "$NGINX_CONFIG"; then
    echo -e "${YELLOW}⚠️  Financial Calculators config already exists in nginx${NC}"
    echo "Skipping nginx modification. Please add manually if needed."
else
    # Insert before the main location / block
    if grep -q "location / {" "$NGINX_CONFIG"; then
        sed -i '/location \/ {/i\    # FINANCIAL CALCULATORS CONFIGURATION' "$NGINX_CONFIG"
        sed -i '/# FINANCIAL CALCULATORS CONFIGURATION/r /tmp/investment-calculator-nginx.conf' "$NGINX_CONFIG"
        sed -i '/# FINANCIAL CALCULATORS CONFIGURATION/d' "$NGINX_CONFIG"
        echo -e "${GREEN}✓ Nginx configuration added${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not automatically add nginx config${NC}"
        echo "Please manually add the config from: /tmp/investment-calculator-nginx.conf"
    fi
fi

# Test nginx config
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    nginx -s reload
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    echo "Restoring backup..."
    LATEST_BACKUP=$(ls -t "$NGINX_CONFIG.backup."* | head -1)
    cp "$LATEST_BACKUP" "$NGINX_CONFIG"
    exit 1
fi

echo ""

# ========================================
# Set Permissions
# ========================================
echo -e "${YELLOW}🔐 Step 4: Setting permissions...${NC}"

chown -R www-data:www-data "$APP_DIR/frontend" 2>/dev/null || true
chmod -R 755 "$APP_DIR/frontend" 2>/dev/null || true

echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# ========================================
# Test Deployment
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🧪 Step 5: Testing deployment...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

sleep 3

# Test backend if exists
if [ "$HAS_BACKEND" = true ]; then
    BACKEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/docs 2>/dev/null || echo "000")
    if [ "$BACKEND_CODE" = "200" ] || [ "$BACKEND_CODE" = "404" ]; then
        echo -e "${GREEN}✅ Backend responding (HTTP $BACKEND_CODE)${NC}"
    else
        echo -e "${RED}❌ Backend not responding (HTTP $BACKEND_CODE)${NC}"
    fi
fi

# Test Next.js
NEXTJS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/investment-calculator/ 2>/dev/null || echo "000")
if [ "$NEXTJS_CODE" = "200" ] || [ "$NEXTJS_CODE" = "308" ]; then
    echo -e "${GREEN}✅ Next.js responding (HTTP $NEXTJS_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js status: HTTP $NEXTJS_CODE${NC}"
fi

# Test frontend through nginx
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/investment-calculator/ 2>/dev/null || echo "000")
if [ "$FRONTEND_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend accessible via Nginx (HTTP $FRONTEND_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend status via Nginx: HTTP $FRONTEND_CODE${NC}"
fi

# Check PM2 status
echo ""
echo "PM2 Process Status:"
pm2 status | grep -E "investment-calculator|name" || pm2 list

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Financial Calculators Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "📊 Service Information:"
echo "  - Backend Name: $BACKEND_NAME (FastAPI)"
echo "  - Backend Port: $BACKEND_PORT"
echo "  - Frontend: Next.js (Port 3000)"
echo "  - Directory: $APP_DIR"
echo ""
echo "🌐 Access URLs:"
echo "  - Frontend: http://82.25.105.18/investment-calculator/"
echo "  - Backend API Docs: http://82.25.105.18/api/investment-calculator/docs"
echo "  - Backend API: http://82.25.105.18/api/investment-calculator/"
echo ""
echo "🔧 Management Commands:"
echo "  - Backend logs: pm2 logs $BACKEND_NAME"
echo "  - Frontend logs: pm2 logs investment-calculator-frontend"
echo "  - Restart backend: pm2 restart $BACKEND_NAME"
echo "  - Restart frontend: pm2 restart investment-calculator-frontend"
echo "  - Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
echo "✅ All existing applications remain untouched!"
echo ""
