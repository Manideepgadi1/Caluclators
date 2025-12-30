# 🚀 VPS Deployment Quick Start

Complete production deployment files for hosting Financial Calculators on a VPS.

## 📦 What's Included

### Docker Configuration
- `Dockerfile.backend` - Multi-stage Python/FastAPI container
- `Dockerfile.frontend` - Multi-stage Node.js/Next.js container
- `docker-compose.yml` - Complete orchestration setup
- `.dockerignore` - Optimized Docker builds

### Nginx Configuration
- `nginx/financial-calculators.conf` - Production-ready reverse proxy
  - SSL/HTTPS support
  - Rate limiting
  - Security headers
  - Gzip compression
  - Caching strategies

### Systemd Services (Alternative to Docker)
- `systemd/financial-backend.service` - Backend service for Linux

### Environment Templates
- `.env.example` - Root environment variables
- `backend/.env.example` - Backend configuration
- `frontend/.env.example` - Frontend configuration

### Deployment Scripts
- `scripts/deploy-vps.sh` - **Automated one-command deployment** ⭐
- `scripts/update-app.sh` - Quick update script
- `scripts/health-check.sh` - Application health monitoring
- `scripts/backup.sh` - Automated backup system

### Documentation
- `DEPLOYMENT.md` - **Complete deployment guide** (READ THIS FIRST!)

---

## ⚡ Quick Deploy (3 Steps)

### 1️⃣ Prepare Your VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Create app directory
mkdir -p /var/www/financial-calculators
```

### 2️⃣ Upload Your Code

**Option A: Git (Recommended)**
```bash
cd /var/www/financial-calculators
git clone https://github.com/yourusername/financial-calculators.git .
```

**Option B: SCP from local machine**
```bash
# From Windows PowerShell
scp -r d:\Caluclators\* root@your-vps-ip:/var/www/financial-calculators/
```

### 3️⃣ Run Automated Deployment

```bash
cd /var/www/financial-calculators
chmod +x scripts/deploy-vps.sh
sudo ./scripts/deploy-vps.sh
```

The script will automatically:
- ✅ Install Docker & Docker Compose
- ✅ Install Nginx
- ✅ Configure environment variables
- ✅ Build and start containers
- ✅ Set up Nginx reverse proxy
- ✅ Obtain SSL certificate (Let's Encrypt)
- ✅ Configure firewall
- ✅ Set up automated backups

**Your app will be live at `https://yourdomain.com` in ~5 minutes!** 🎉

---

## 📖 Detailed Instructions

For complete documentation, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Key Sections:
- [Prerequisites](DEPLOYMENT.md#prerequisites)
- [Docker Deployment](DEPLOYMENT.md#docker-deployment-recommended)
- [Manual Deployment](DEPLOYMENT.md#manual-deployment)
- [SSL Setup](DEPLOYMENT.md#sslhttps-setup)
- [Monitoring & Maintenance](DEPLOYMENT.md#monitoring--maintenance)

---

## 🛠️ Common Commands

### Docker Deployment

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull && docker-compose up -d --build
```

### Health Checks

```bash
# Run health check
./scripts/health-check.sh

# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend
```

### Backups

```bash
# Manual backup
./scripts/backup.sh

# Backups are automatically created daily at 2 AM
# Location: /root/backups/
```

---

## 🔒 Security Checklist

- [ ] Changed default `SECRET_KEY` in `.env`
- [ ] Updated `ALLOWED_ORIGINS` with your domain
- [ ] SSL certificate installed and auto-renewal enabled
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Fail2ban installed (optional but recommended)
- [ ] Regular backups scheduled

---

## 🌐 VPS Providers

This deployment works with all major VPS providers:

| Provider | Recommended Plan | Price |
|----------|------------------|-------|
| **DigitalOcean** | Droplet (2GB RAM) | $12/mo |
| **Linode** | Nanode (2GB RAM) | $12/mo |
| **Vultr** | Cloud Compute (2GB RAM) | $12/mo |
| **AWS Lightsail** | 2GB RAM | $10/mo |
| **Hetzner** | CX21 (2GB RAM) | €5.83/mo |

*Minimum: 1GB RAM, but 2GB recommended for production*

---

## 📊 Architecture

```
Internet
    ↓
Nginx (Port 80/443)
    ├─→ Frontend (Port 3000) - Next.js
    └─→ Backend (Port 8000) - FastAPI
```

---

## 🐛 Troubleshooting

### Backend not responding
```bash
docker-compose logs backend
docker-compose restart backend
```

### Frontend not loading
```bash
docker-compose logs frontend
docker-compose restart frontend
```

### SSL certificate issues
```bash
sudo certbot renew
sudo systemctl restart nginx
```

### Nginx 502 error
```bash
# Check if containers are running
docker-compose ps

# Restart all services
docker-compose restart
sudo systemctl restart nginx
```

---

## 📈 Performance Tips

1. **Enable Cloudflare** for global CDN and DDoS protection
2. **Add Redis** for caching (optional)
3. **Add PostgreSQL** for persistent data (optional)
4. **Monitor with Uptime Robot** or similar service
5. **Use PM2** instead of Docker for lower resource usage

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/financial-calculators
            git pull
            docker-compose up -d --build
```

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## ✅ Post-Deployment Verification

After deployment, verify:

1. **Frontend**: `https://yourdomain.com` loads correctly
2. **API Docs**: `https://yourdomain.com/docs` shows FastAPI docs
3. **Calculators**: Test at least one calculator from each category
4. **SSL**: Check for green padlock in browser
5. **Performance**: Test load speed with GTmetrix or PageSpeed

---

**Ready to deploy? Start with Step 1 above!** 🚀
