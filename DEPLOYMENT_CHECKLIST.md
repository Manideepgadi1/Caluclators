# VPS Deployment Checklist

## Pre-Deployment

### Local Preparation
- [ ] Test application locally (both backend and frontend working)
- [ ] All code committed to Git repository
- [ ] Environment variables documented
- [ ] Domain name purchased (optional but recommended)
- [ ] VPS account created (DigitalOcean, Linode, Vultr, etc.)

### VPS Setup
- [ ] VPS instance created (Ubuntu 20.04/22.04 LTS)
- [ ] Minimum 1GB RAM (2GB+ recommended)
- [ ] SSH access configured
- [ ] Root or sudo access available

### DNS Configuration (if using domain)
- [ ] A record pointing to VPS IP address
- [ ] WWW subdomain configured
- [ ] DNS propagation verified (may take up to 48 hours)

---

## Deployment Process

### Step 1: Initial VPS Setup
- [ ] SSH into VPS: `ssh root@your-vps-ip`
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Create app directory: `mkdir -p /var/www/financial-calculators`

### Step 2: Upload Code
- [ ] Code uploaded via Git or SCP
- [ ] All files present in `/var/www/financial-calculators/`
- [ ] Deployment files present (docker-compose.yml, Dockerfiles, etc.)

### Step 3: Run Deployment Script
- [ ] Make script executable: `chmod +x scripts/deploy-vps.sh`
- [ ] Run deployment: `sudo ./scripts/deploy-vps.sh`
- [ ] Enter domain name when prompted
- [ ] Enter email for SSL certificate
- [ ] Script completes without errors

### Step 4: Verify Installation
- [ ] Docker installed: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Nginx installed: `nginx -v`
- [ ] Certbot installed: `certbot --version`

---

## Configuration

### Environment Variables
- [ ] `.env` file created in root directory
- [ ] `SECRET_KEY` changed from default
- [ ] `DOMAIN` set to your domain
- [ ] `ALLOWED_ORIGINS` updated with your domain
- [ ] `NEXT_PUBLIC_API_URL` points to correct API URL

### Docker Containers
- [ ] Backend container running: `docker-compose ps | grep backend`
- [ ] Frontend container running: `docker-compose ps | grep frontend`
- [ ] No errors in logs: `docker-compose logs`
- [ ] Containers healthy: Check health status

### Nginx Configuration
- [ ] Nginx config file present: `/etc/nginx/sites-available/financial-calculators`
- [ ] Site enabled: Symlink in `/etc/nginx/sites-enabled/`
- [ ] Nginx config test passes: `sudo nginx -t`
- [ ] Nginx running: `sudo systemctl status nginx`

### SSL Certificate
- [ ] SSL certificate obtained from Let's Encrypt
- [ ] Certificate valid: `sudo certbot certificates`
- [ ] HTTPS redirect working
- [ ] Auto-renewal enabled: `sudo certbot renew --dry-run`

### Firewall
- [ ] UFW installed and enabled
- [ ] Port 22 (SSH) allowed
- [ ] Port 80 (HTTP) allowed
- [ ] Port 443 (HTTPS) allowed
- [ ] Firewall status: `sudo ufw status`

---

## Testing

### Backend Testing
- [ ] Backend API accessible: `curl http://localhost:8000/docs`
- [ ] API documentation loads: Visit `/docs` endpoint
- [ ] Health endpoint works (if configured)
- [ ] No errors in backend logs: `docker-compose logs backend`

### Frontend Testing
- [ ] Frontend accessible: `curl http://localhost:3000`
- [ ] Homepage loads correctly
- [ ] No console errors in browser
- [ ] No errors in frontend logs: `docker-compose logs frontend`

### Full Stack Testing
- [ ] Application accessible via domain: `https://yourdomain.com`
- [ ] HTTPS working (green padlock in browser)
- [ ] API documentation: `https://yourdomain.com/docs`
- [ ] Test Retirement Calculator
- [ ] Test SIP Growth Calculator
- [ ] Test Single Amount Calculator
- [ ] All calculators return results
- [ ] No CORS errors
- [ ] API requests completing successfully

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images and assets loading
- [ ] Mobile responsive design working
- [ ] Browser console shows no errors

---

## Security

### Basic Security
- [ ] Changed all default passwords
- [ ] SSH key authentication enabled (recommended)
- [ ] Password authentication disabled (recommended)
- [ ] Non-root user created (recommended)
- [ ] Fail2ban installed (optional): `sudo apt install fail2ban`

### Application Security
- [ ] Environment variables not exposed in client code
- [ ] CORS properly configured
- [ ] Rate limiting enabled in Nginx
- [ ] Security headers present in response
- [ ] SQL injection protection (if using database)
- [ ] XSS protection enabled

### SSL/TLS
- [ ] SSL certificate valid and not expired
- [ ] Strong cipher suites configured
- [ ] TLS 1.2+ only
- [ ] HSTS header present
- [ ] Certificate auto-renewal working

---

## Monitoring & Maintenance

### Monitoring Setup
- [ ] Health check script working: `./scripts/health-check.sh`
- [ ] Error logging configured
- [ ] Access logs being written
- [ ] Disk space monitoring set up
- [ ] Uptime monitoring (optional): UptimeRobot, Pingdom, etc.

### Backup Configuration
- [ ] Backup script working: `./scripts/backup.sh`
- [ ] Automated daily backups enabled
- [ ] Backup location: `/root/backups/`
- [ ] Old backups being cleaned (7+ days)
- [ ] Test restore from backup

### Maintenance Tasks
- [ ] Update script working: `./scripts/update-app.sh`
- [ ] Automatic security updates enabled
- [ ] Log rotation configured
- [ ] Monitoring alerts configured (optional)

---

## Post-Deployment

### Documentation
- [ ] Document VPS IP address
- [ ] Document domain name
- [ ] Document SSH access details
- [ ] Document environment variable values (keep secure!)
- [ ] Document database credentials (if applicable)
- [ ] Create runbook for common tasks

### Team Handoff
- [ ] Share deployment documentation
- [ ] Provide access credentials securely
- [ ] Document troubleshooting steps
- [ ] Set up monitoring alerts
- [ ] Schedule review meeting

### Optimization
- [ ] Enable Cloudflare (optional)
- [ ] Set up CDN for static assets (optional)
- [ ] Configure Redis caching (optional)
- [ ] Add database if needed (optional)
- [ ] Set up CI/CD pipeline (optional)

---

## Common Issues

### Issue: Containers not starting
- [ ] Check logs: `docker-compose logs`
- [ ] Verify Docker installed correctly
- [ ] Check disk space: `df -h`
- [ ] Verify environment variables

### Issue: Nginx 502 Bad Gateway
- [ ] Containers running: `docker-compose ps`
- [ ] Backend accessible: `curl http://localhost:8000`
- [ ] Frontend accessible: `curl http://localhost:3000`
- [ ] Restart services: `docker-compose restart`

### Issue: SSL certificate not working
- [ ] DNS propagated: `nslookup yourdomain.com`
- [ ] Domain pointing to correct IP
- [ ] Certbot logs: `sudo journalctl -u certbot`
- [ ] Try manual: `sudo certbot --nginx -d yourdomain.com`

### Issue: API CORS errors
- [ ] `ALLOWED_ORIGINS` includes your domain
- [ ] Nginx CORS headers configured
- [ ] Backend CORS middleware enabled
- [ ] Check browser console for details

---

## Rollback Plan

### If Deployment Fails
1. [ ] Stop containers: `docker-compose down`
2. [ ] Restore from backup: `tar -xzf /root/backups/app_*.tar.gz`
3. [ ] Check logs for errors
4. [ ] Fix issues and retry deployment

### Emergency Contacts
- [ ] VPS provider support contact
- [ ] Domain registrar support
- [ ] Development team contacts
- [ ] SSL certificate support (Let's Encrypt community)

---

## Success Criteria

### Deployment Successful When:
- ✅ Application accessible via HTTPS
- ✅ All calculators functioning correctly
- ✅ API documentation accessible
- ✅ SSL certificate valid
- ✅ No errors in logs
- ✅ Performance acceptable (<3s load time)
- ✅ Backups configured and working
- ✅ Monitoring in place

---

## Next Steps

### After Successful Deployment
1. [ ] Monitor application for 24 hours
2. [ ] Test all functionality thoroughly
3. [ ] Set up additional monitoring (optional)
4. [ ] Configure analytics (optional)
5. [ ] Add database if needed
6. [ ] Set up CI/CD pipeline
7. [ ] Document any issues encountered
8. [ ] Create incident response plan
9. [ ] Schedule regular maintenance

### Future Enhancements
- [ ] Add user authentication
- [ ] Add database for user data
- [ ] Add caching layer (Redis)
- [ ] Implement rate limiting per user
- [ ] Add email notifications
- [ ] Add PDF report generation
- [ ] Add more calculators
- [ ] Mobile app development

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Deployer | | | |
| Reviewer | | | |
| Approver | | | |

---

**Deployment Status:** [ ] In Progress  [ ] Complete  [ ] Failed

**Deployment Date:** _________________

**Deployed By:** _________________

**Domain:** _________________

**VPS IP:** _________________

---

✅ **Ready for Production!**
