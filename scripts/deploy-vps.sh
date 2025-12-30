#!/bin/bash

# VPS Deployment Script for Financial Calculators
# This script automates the deployment process on a fresh Ubuntu/Debian VPS

set -e  # Exit on error

echo "========================================="
echo "Financial Calculators - VPS Deployment"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Get domain name from user
read -p "Enter your domain name (e.g., example.com): " DOMAIN
read -p "Enter your email for SSL certificate: " EMAIL

print_info "Domain: $DOMAIN"
print_info "Email: $EMAIL"
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    print_error "Deployment cancelled"
    exit 1
fi

# Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Install Docker
print_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Install Docker Compose
print_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt install docker-compose -y
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Install Nginx
print_info "Installing Nginx..."
apt install nginx -y
print_success "Nginx installed"

# Install Certbot for SSL
print_info "Installing Certbot..."
apt install certbot python3-certbot-nginx -y
print_success "Certbot installed"

# Create app directory
APP_DIR="/var/www/financial-calculators"
print_info "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Check if code is already present
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please upload your application code to $APP_DIR first"
    print_info "You can use: scp -r /path/to/code root@your-vps-ip:$APP_DIR"
    exit 1
fi

# Create .env file
print_info "Creating environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    
    # Generate secret key
    SECRET_KEY=$(openssl rand -hex 32)
    
    # Update .env file
    sed -i "s|DOMAIN=yourdomain.com|DOMAIN=$DOMAIN|g" .env
    sed -i "s|yourdomain.com|$DOMAIN|g" .env
    sed -i "s|CHANGE-THIS-TO-A-SECURE-RANDOM-STRING-MINIMUM-32-CHARACTERS|$SECRET_KEY|g" .env
    
    print_success "Environment file created"
else
    print_success "Environment file already exists"
fi

# Build and start Docker containers
print_info "Building and starting Docker containers..."
docker-compose down 2>/dev/null || true
docker-compose up -d --build
print_success "Docker containers started"

# Wait for containers to be healthy
print_info "Waiting for containers to be healthy..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_success "Containers are running"
else
    print_error "Containers failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Configure Nginx
print_info "Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/financial-calculators"

# Copy Nginx configuration
cp nginx/financial-calculators.conf $NGINX_CONF

# Update domain in Nginx config
sed -i "s|yourdomain.com|$DOMAIN|g" $NGINX_CONF

# Enable site
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/financial-calculators

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration has errors"
    exit 1
fi

# Reload Nginx
systemctl reload nginx
print_success "Nginx configured and reloaded"

# Configure firewall
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured"
else
    print_info "UFW not found, skipping firewall configuration"
fi

# Get SSL certificate
print_info "Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained"
else
    print_error "Failed to obtain SSL certificate"
    print_info "You can try manually later with: certbot --nginx -d $DOMAIN"
fi

# Set up automatic renewal
print_info "Setting up automatic SSL renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer
print_success "SSL auto-renewal configured"

# Create backup script
print_info "Creating backup script..."
cat > /root/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/financial-calculators
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
echo "Backup completed: $DATE"
EOF

chmod +x /root/backup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup.sh") | crontab -
print_success "Backup script created and scheduled"

# Final checks
echo ""
print_info "Running final checks..."

# Check Docker containers
if docker-compose ps | grep -q "Up"; then
    print_success "Backend container: Running"
    print_success "Frontend container: Running"
else
    print_error "Some containers are not running"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    print_success "Nginx: Running"
else
    print_error "Nginx: Not running"
fi

# Check SSL
if certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
    print_success "SSL certificate: Installed"
else
    print_error "SSL certificate: Not found"
fi

echo ""
echo "========================================="
echo "         DEPLOYMENT COMPLETE! 🚀"
echo "========================================="
echo ""
echo "Your application is now live at:"
echo "→ https://$DOMAIN"
echo "→ API Documentation: https://$DOMAIN/docs"
echo ""
echo "Useful commands:"
echo "→ View logs: cd $APP_DIR && docker-compose logs -f"
echo "→ Restart app: cd $APP_DIR && docker-compose restart"
echo "→ Stop app: cd $APP_DIR && docker-compose down"
echo "→ Update app: cd $APP_DIR && git pull && docker-compose up -d --build"
echo ""
echo "Backup location: /root/backups/ (daily at 2 AM)"
echo ""
print_success "Deployment successful!"
