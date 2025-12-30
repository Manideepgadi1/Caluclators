# VPS Deployment Guide - Financial Calculators

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Docker Deployment (Recommended)](#docker-deployment-recommended)
4. [Manual Deployment](#manual-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Environment Variables](#environment-variables)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### VPS Requirements
- **OS:** Ubuntu 20.04/22.04 LTS or Debian 11/12
- **RAM:** Minimum 1GB (2GB+ recommended)
- **Storage:** 10GB minimum
- **CPU:** 1 vCPU minimum (2+ recommended)

### Software Requirements
- **Option 1 (Docker):** Docker & Docker Compose
- **Option 2 (Manual):** Python 3.11+, Node.js 18+, Nginx, PM2

### Domain & DNS
- Domain name (optional but recommended)
- DNS A record pointing to your VPS IP

---

## Deployment Options

### Option 1: Docker Deployment (Recommended) ⭐
- **Pros:** Easy to deploy, isolated environment, easy rollback
- **Cons:** Slightly more resource usage
- **Best for:** Production deployments, scalability

### Option 2: Manual Deployment
- **Pros:** Direct control, lighter resource usage
- **Cons:** More complex setup, manual dependency management
- **Best for:** Customized environments, limited resources

---

## Docker Deployment (Recommended)

### Step 1: Prepare Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Upload Your Code

**Option A: Git (Recommended)**
```bash
# Install git if not already installed
sudo apt install git -y

# Clone your repository
git clone https://github.com/yourusername/financial-calculators.git
cd financial-calculators
```

**Option B: SCP from local machine**
```bash
# From your local machine (Windows PowerShell)
scp -r d:\Caluclators root@your-vps-ip:/root/financial-calculators
```

### Step 3: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following:
```env
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production

# Optional: Database (if you add one later)
# DATABASE_URL=postgresql://user:password@localhost:5432/financialdb
```

### Step 4: Build and Run with Docker

```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Step 5: Set Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/financial-calculators
```

Add configuration (see [Nginx Configuration](#nginx-configuration) section)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/financial-calculators /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Manual Deployment

### Step 1: Prepare VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Upload Code

```bash
# Create app directory
mkdir -p /var/www/financial-calculators
cd /var/www/financial-calculators

# Upload files (use git or scp as shown above)
```

### Step 3: Set Up Backend

```bash
cd /var/www/financial-calculators/backend

# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create systemd service
sudo nano /etc/systemd/system/financial-backend.service
```

Add the following service configuration:
```ini
[Unit]
Description=Financial Calculators Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/financial-calculators/backend
Environment="PATH=/var/www/financial-calculators/backend/venv/bin"
ExecStart=/var/www/financial-calculators/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable financial-backend
sudo systemctl start financial-backend
sudo systemctl status financial-backend
```

### Step 4: Set Up Frontend

```bash
cd /var/www/financial-calculators/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Create PM2 ecosystem file
nano ecosystem.config.js
```

Add the following:
```javascript
module.exports = {
  apps: [{
    name: 'financial-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/financial-calculators/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

---

## Nginx Configuration

### For Docker Deployment

Create `/etc/nginx/sites-available/financial-calculators`:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    client_max_body_size 10M;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type' always;
    }

    # Backend API docs
    location /docs {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /openapi.json {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### With SSL (After Certbot)

Certbot will automatically modify your config, but you should add these optimizations:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # ... rest of configuration from above ...
}
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will:
# 1. Verify domain ownership
# 2. Issue certificate
# 3. Automatically configure Nginx
# 4. Set up auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

### Verify SSL

```bash
# Check certificate status
sudo certbot certificates

# Check SSL configuration
curl -I https://yourdomain.com
```

---

## Environment Variables

### Backend (.env in backend/)

```env
# Server Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=production
DEBUG=false

# CORS Settings
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security (generate strong secret)
SECRET_KEY=your-super-secret-key-change-this-in-production

# Database (if added)
# DATABASE_URL=postgresql://user:password@localhost:5432/financialdb

# Logging
LOG_LEVEL=INFO
```

### Frontend (.env.local in frontend/)

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Environment
NODE_ENV=production

# Build optimization
NEXT_TELEMETRY_DISABLED=1
```

---

## Monitoring & Maintenance

### Check Application Status

**Docker:**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart containers
docker-compose restart
```

**Manual (Systemd + PM2):**
```bash
# Backend status
sudo systemctl status financial-backend
sudo journalctl -u financial-backend -f

# Frontend status
pm2 status
pm2 logs financial-frontend
```

### Monitor Resources

```bash
# Install htop for monitoring
sudo apt install htop -y
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Monitor Nginx access
sudo tail -f /var/log/nginx/access.log

# Monitor Nginx errors
sudo tail -f /var/log/nginx/error.log
```

### Backup Strategy

```bash
# Create backup script
sudo nano /root/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/financial-calculators

# Backup Nginx config
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
sudo chmod +x /root/backup.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /root/backup.sh
```

### Update Application

**Docker:**
```bash
cd /var/www/financial-calculators
git pull origin main
docker-compose down
docker-compose up -d --build
```

**Manual:**
```bash
cd /var/www/financial-calculators
git pull origin main

# Update backend
sudo systemctl restart financial-backend

# Update frontend
cd frontend
npm install
npm run build
pm2 restart financial-frontend
```

### Security Best Practices

1. **Firewall Configuration:**
```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

2. **Fail2ban (Protection against brute force):**
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

3. **Regular Updates:**
```bash
# Set up automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
sudo journalctl -u financial-backend -n 50

# Verify Python version
python3.11 --version

# Test manually
cd /var/www/financial-calculators/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Build Issues
```bash
# Check Node.js version
node --version

# Clear cache and rebuild
cd /var/www/financial-calculators/frontend
rm -rf .next node_modules
npm install
npm run build
```

### Nginx 502 Bad Gateway
```bash
# Check if backend is running
curl http://localhost:8000

# Check if frontend is running
curl http://localhost:3000

# Restart services
sudo systemctl restart financial-backend
pm2 restart financial-frontend
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Test SSL configuration
curl -I https://yourdomain.com
```

---

## Performance Optimization

### 1. Enable Gzip Compression in Nginx

Add to nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Enable Caching

```nginx
# Static assets caching
location /_next/static {
    proxy_pass http://frontend;
    proxy_cache_valid 200 60m;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Connection Pooling (when you add a database)

In backend requirements.txt, use connection pooling libraries.

### 4. CDN Integration

Consider using Cloudflare for:
- Global CDN
- DDoS protection
- Free SSL
- Performance optimization

---

## Quick Command Reference

```bash
# Docker
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart

# Systemd (Backend)
sudo systemctl start financial-backend
sudo systemctl stop financial-backend
sudo systemctl restart financial-backend
sudo systemctl status financial-backend

# PM2 (Frontend)
pm2 start financial-frontend
pm2 stop financial-frontend
pm2 restart financial-frontend
pm2 logs financial-frontend

# Nginx
sudo systemctl restart nginx
sudo nginx -t                 # Test config
sudo tail -f /var/log/nginx/error.log

# SSL
sudo certbot renew
sudo certbot certificates
```

---

## Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] SSL certificate installed and valid
- [ ] All calculator endpoints working
- [ ] API documentation accessible
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup script configured
- [ ] Auto-updates enabled
- [ ] Error logging working
- [ ] Performance optimized

---

## Support & Resources

- **Nginx Documentation:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/
- **PM2 Documentation:** https://pm2.keymetrics.io/
- **Docker Documentation:** https://docs.docker.com/

---

**Deployment Complete!** 🚀

Your Financial Calculators application should now be live and accessible at your domain!
