#!/bin/bash

# Backup Script for Financial Calculators
# Creates timestamped backups of application and configuration

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/financial-calculators"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "========================================="
echo "Creating Backup: $DATE"
echo "========================================="

# Backup application code
echo "→ Backing up application code..."
tar -czf $BACKUP_DIR/app_$DATE.tar.gz $APP_DIR
echo "✓ Application backup created"

# Backup Nginx configuration
echo "→ Backing up Nginx configuration..."
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available /etc/nginx/sites-enabled
echo "✓ Nginx backup created"

# Backup SSL certificates
if [ -d "/etc/letsencrypt" ]; then
    echo "→ Backing up SSL certificates..."
    tar -czf $BACKUP_DIR/ssl_$DATE.tar.gz /etc/letsencrypt
    echo "✓ SSL backup created"
fi

# Backup Docker volumes (if any data volumes exist)
if docker volume ls | grep -q financial; then
    echo "→ Backing up Docker volumes..."
    docker run --rm -v financial-calculators_backend-logs:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_$DATE.tar.gz /data
    echo "✓ Docker volumes backup created"
fi

# Clean up old backups (keep last 7 days)
echo "→ Cleaning up old backups..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
echo "✓ Old backups cleaned"

# List current backups
echo ""
echo "Current backups:"
ls -lh $BACKUP_DIR | grep .tar.gz

# Calculate total backup size
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo ""
echo "Total backup size: $TOTAL_SIZE"
echo ""
echo "✓ Backup completed: $DATE"
echo "========================================="
