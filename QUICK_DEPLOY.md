# 🚀 Quick Deployment Guide - TL;DR

## For the Impatient Developer

### Prerequisites
- Ubuntu VPS (1GB+ RAM)
- Domain name (optional)
- SSH access

### 3-Command Deployment

```bash
# 1. Upload code to VPS
scp -r d:\Caluclators\* root@YOUR_VPS_IP:/var/www/financial-calculators/

# 2. SSH into VPS
ssh root@YOUR_VPS_IP

# 3. Run deployment script
cd /var/www/financial-calculators && chmod +x scripts/deploy-vps.sh && sudo ./scripts/deploy-vps.sh
```

**Done! Your app will be live in 5 minutes.** 🎉

---

## What Gets Installed

✅ Docker + Docker Compose  
✅ Nginx (reverse proxy)  
✅ SSL Certificate (Let's Encrypt)  
✅ Firewall (UFW)  
✅ Automated backups  

---

## Verify Deployment

```bash
# Check containers
docker-compose ps

# Check application
curl https://yourdomain.com

# Check API
curl https://yourdomain.com/docs
```

---

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart app
docker-compose restart

# Stop app
docker-compose down

# Update app
git pull && docker-compose up -d --build

# Health check
./scripts/health-check.sh

# Backup
./scripts/backup.sh
```

---

## Troubleshooting One-Liners

```bash
# Containers not running?
docker-compose up -d --build

# Nginx issues?
sudo nginx -t && sudo systemctl restart nginx

# SSL problems?
sudo certbot renew && sudo systemctl reload nginx

# View all logs
docker-compose logs -f
```

---

## Files You Need to Know

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Complete guide (READ THIS!) |
| `DEPLOYMENT_README.md` | Quick start overview |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |
| `docker-compose.yml` | Container orchestration |
| `.env` | Environment variables |
| `nginx/financial-calculators.conf` | Nginx config |
| `scripts/deploy-vps.sh` | Auto-deployment script |

---

## Security Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Update `ALLOWED_ORIGINS` with your domain
- [ ] SSL installed (auto-done by script)
- [ ] Firewall enabled (auto-done by script)

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://yourdomain.com` |
| API Docs | `https://yourdomain.com/docs` |
| Backend | `https://yourdomain.com/api` |

---

## When Things Go Wrong

```bash
# Nuclear option - restart everything
docker-compose down && docker-compose up -d --build && sudo systemctl restart nginx
```

---

## Cost Estimate

| Provider | Plan | Cost/Month |
|----------|------|------------|
| DigitalOcean | 2GB Droplet | $12 |
| Linode | Nanode 2GB | $12 |
| Vultr | 2GB Cloud | $12 |
| Hetzner | CX21 | €5.83 |

---

## Need Help?

1. Check `DEPLOYMENT.md` (comprehensive guide)
2. Run `./scripts/health-check.sh`
3. Check logs: `docker-compose logs`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

**That's it! Happy deploying! 🚀**
