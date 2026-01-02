# Simple Deployment Guide

## Quick Deploy Workflow

### When You Make Changes:

**Option 1: One-Command Deploy (Recommended)**
```bash
# On Windows (pushes to GitHub and updates VPS automatically)
push-and-deploy.bat
```

**Option 2: Manual Steps**
```bash
# Step 1: Push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Step 2: Update VPS
ssh root@82.25.105.18
cd /var/www/financial-calculators
./scripts/pull-and-restart.sh
```

---

## Setup (One-Time Only)

### 1. On Your Local Machine

Make sure the script is ready:
```bash
# The script is already created at:
d:\Caluclators\push-and-deploy.bat
```

### 2. On Your VPS

```bash
# SSH into your VPS
ssh root@82.25.105.18

# Navigate to app directory
cd /var/www/financial-calculators

# Make the script executable
chmod +x scripts/pull-and-restart.sh

# Test the script
./scripts/pull-and-restart.sh
```

---

## Usage Examples

### Deploy Changes After Editing
```bash
# Just double-click: push-and-deploy.bat
# Or run in PowerShell:
.\push-and-deploy.bat
```

### VPS-Only Update (if you already pushed to GitHub)
```bash
ssh root@82.25.105.18 "cd /var/www/financial-calculators && ./scripts/pull-and-restart.sh"
```

### Check VPS Status
```bash
ssh root@82.25.105.18 "cd /var/www/financial-calculators && docker-compose ps"
```

### View VPS Logs
```bash
ssh root@82.25.105.18 "cd /var/www/financial-calculators && docker-compose logs -f"
```

---

## What Happens During Deploy?

1. **Local**: Your changes are committed and pushed to GitHub
2. **VPS**: Latest code is pulled from GitHub
3. **VPS**: Docker containers are rebuilt with new code
4. **VPS**: Services restart automatically
5. **Done**: Your changes are live!

---

## Troubleshooting

### "Permission denied" when running script
```bash
chmod +x scripts/pull-and-restart.sh
```

### "Not a git repository"
```bash
# Initialize git if needed
cd /var/www/financial-calculators
git init
git remote add origin YOUR_GITHUB_REPO_URL
git pull origin main
```

### Containers not starting
```bash
# Check logs
docker-compose logs

# Check container status
docker-compose ps

# Restart manually
docker-compose down
docker-compose up -d --build
```

### Changes not appearing
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -f
docker-compose up -d --build
```

---

## Files Created

- `push-and-deploy.bat` - Local script to push and deploy in one command
- `scripts/pull-and-restart.sh` - VPS script to pull code and restart services
- `DEPLOY_GUIDE.md` - This guide

---

## Advanced: Setup Auto-Deploy with Webhook (Optional)

If you want automatic deployment when you push to GitHub:

1. Install webhook on VPS:
```bash
apt install webhook -y
```

2. Create webhook configuration:
```bash
cat > /etc/webhook.conf << 'EOF'
[
  {
    "id": "deploy-financial-calculators",
    "execute-command": "/var/www/financial-calculators/scripts/pull-and-restart.sh",
    "command-working-directory": "/var/www/financial-calculators",
    "response-message": "Deploying...",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "YOUR_SECRET_HERE",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF
```

3. Start webhook service:
```bash
webhook -hooks /etc/webhook.conf -verbose -port 9000
```

4. Add webhook to GitHub repository settings:
   - URL: `http://YOUR_VPS_IP:9000/hooks/deploy-financial-calculators`
   - Secret: YOUR_SECRET_HERE
   - Content type: application/json
   - Events: Just the push event

Now every push to GitHub will automatically deploy to your VPS!
