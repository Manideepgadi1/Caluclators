# Financial Calculators Module

A production-ready financial calculators platform with comprehensive Life Goal, Financial, and Quick Tools calculators.

## 🚀 Features

### Life Goal Calculators
- Plan Your Retirement
- Child Education
- Marriage for Child  
- Your Other Goal (Custom)

### Financial Calculators
- SIP Growth
- SIP Need
- SIP Delay Cost
- SWP Calculator

### Quick Tools
- Single Amount (PV/FV)
- Irregular Cash Flow
- Weighted Avg. Returns

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

**Backend:**
- Python 3.11+
- FastAPI
- Pydantic
- Uvicorn

## 📦 Quick Start

### Local Development

**Using Batch Files (Windows):**
```bash
# Start both backend and frontend
start-all.bat

# Or start individually
start-backend.bat
start-frontend.bat
```

**Manual Setup:**

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs

**Local Development:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🚀 Production Deployment (VPS)

### Quick Deploy (Automated)

```bash
# 1. Upload code to your VPS
scp -r d:\Caluclators\* root@YOUR_VPS_IP:/var/www/financial-calculators/

# 2. SSH and run deployment script
ssh root@YOUR_VPS_IP
cd /var/www/financial-calculators
chmod +x scripts/deploy-vps.sh
sudo ./scripts/deploy-vps.sh
```

**What it does:**
- ✅ Installs Docker & Docker Compose
- ✅ Configures Nginx reverse proxy
- ✅ Obtains SSL certificate (Let's Encrypt)
- ✅ Sets up firewall
- ✅ Configures automated backups
- ✅ Your app goes live in ~5 minutes!

### Deployment Options

**Option 1: Docker (Recommended)**
```bash
docker-compose up -d --build
```

**Option 2: Manual Setup**
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

### Deployment Documentation

| Document | Description |
|----------|-------------|
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | **Start here!** TL;DR deployment guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment documentation |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Step-by-step checklist |
| [DEPLOYMENT_README.md](DEPLOYMENT_README.md) | Overview & quick reference |

### VPS Requirements

- **OS:** Ubuntu 20.04/22.04 LTS
- **RAM:** 1GB minimum (2GB+ recommended)
- **Storage:** 10GB minimum
- **Providers:** DigitalOcean, Linode, Vultr, AWS Lightsail, Hetzner

## 📐 Financial Formulas

All calculations use standard financial mathematics:
- Future Value with inflation adjustment
- SIP calculations with compounding
- Present Value discounting
- IRR for irregular cash flows
