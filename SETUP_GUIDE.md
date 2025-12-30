# Financial Calculators - Installation & Setup Guide

## 📋 Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for package management)

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:
- API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
Caluclators/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry
│   │   ├── models/                 # Pydantic models
│   │   │   ├── life_goal.py
│   │   │   ├── financial.py
│   │   │   └── quick_tools.py
│   │   ├── routers/                # API endpoints
│   │   │   ├── life_goal.py
│   │   │   ├── financial.py
│   │   │   └── quick_tools.py
│   │   └── services/               # Business logic
│   │       ├── financial_utils.py
│   │       ├── life_goal_service.py
│   │       ├── financial_service.py
│   │       └── quick_tools_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── CalculatorTabs.tsx      # Main tab navigation
│   │   ├── LifeGoalCalculators.tsx
│   │   ├── FinancialCalculators.tsx
│   │   ├── QuickTools.tsx
│   │   ├── NumberInput.tsx         # Reusable input
│   │   ├── SliderInput.tsx         # Reusable slider
│   │   ├── Dropdown.tsx            # Reusable dropdown
│   │   ├── ResultCard.tsx          # Result display
│   │   └── calculators/            # Individual calculators
│   │       ├── RetirementCalculator.tsx
│   │       ├── EducationCalculator.tsx
│   │       ├── MarriageCalculator.tsx
│   │       ├── OtherGoalCalculator.tsx
│   │       ├── SIPGrowthCalculator.tsx
│   │       ├── SIPNeedCalculator.tsx
│   │       ├── SIPDelayCalculator.tsx
│   │       ├── SWPCalculator.tsx
│   │       ├── SingleAmountCalculator.tsx
│   │       ├── IrregularCashFlowCalculator.tsx
│   │       └── WeightedReturnsCalculator.tsx
│   ├── services/
│   │   └── api.ts                  # API integration
│   ├── utils/
│   │   └── formatters.ts           # Utility functions
│   └── package.json
│
└── README.md
```

## ✨ Features Implemented

### Life Goal Calculators
- ✅ Plan Your Retirement
- ✅ Child Education
- ✅ Marriage for Child
- ✅ Your Other Goal (Custom)

### Financial Calculators
- ✅ SIP Growth
- ✅ SIP Need
- ✅ SIP Delay Cost
- ✅ SWP Calculator

### Quick Tools
- ✅ Single Amount (PV/FV)
- ✅ Irregular Cash Flow
- ✅ Weighted Avg. Returns

## 🎨 UI/UX Features

- ✅ Pixel-perfect design matching reference screenshots
- ✅ Responsive layout (Desktop, Tablet, Mobile)
- ✅ Real-time calculations with debouncing
- ✅ Interactive sliders with visual feedback
- ✅ Indian currency formatting (₹)
- ✅ Smooth animations and transitions
- ✅ Professional fintech-grade interface
- ✅ Accessibility-friendly components

## 🔧 Technical Highlights

### Backend
- FastAPI for high-performance API
- Pydantic for data validation
- Standard financial mathematics formulas
- Comprehensive error handling
- Auto-generated API documentation (Swagger)

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- Debounced inputs for performance
- Component-based architecture

## 📊 Calculation Accuracy

All calculations use **standard financial formulas**:
- Future Value: `FV = PV × (1 + r)^n`
- Present Value: `PV = FV / (1 + r)^n`
- SIP Future Value: Month-by-month compounding
- Retirement Corpus: Annuity-based calculation
- IRR for irregular cash flows

## 🌐 API Endpoints

### Life Goal Calculators
- `POST /api/life-goal/retirement`
- `POST /api/life-goal/education`
- `POST /api/life-goal/marriage`
- `POST /api/life-goal/other-goal`

### Financial Calculators
- `POST /api/financial/sip-growth`
- `POST /api/financial/sip-need`
- `POST /api/financial/sip-delay`
- `POST /api/financial/swp`

### Quick Tools
- `POST /api/quick-tools/single-amount`
- `POST /api/quick-tools/irregular-cash-flow`
- `POST /api/quick-tools/weighted-returns`

## 🛠 Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run on specific port
uvicorn app.main:app --reload --port 8000

# View API docs
# Open http://localhost:8000/docs
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔍 Testing

Test the calculators with various scenarios:
- ✅ Edge cases (zero values, high years)
- ✅ Real-world financial scenarios
- ✅ Input validation
- ✅ Calculation accuracy

## 📝 Notes

- Backend must be running on port 8000 for API calls to work
- Frontend automatically connects to `http://localhost:8000`
- All monetary values use Indian numbering system
- Calculations are performed server-side for accuracy
- Results are debounced to optimize API calls

## 🚀 Production Deployment

### Backend
- Deploy to cloud platform (AWS, Azure, GCP)
- Use Gunicorn with Uvicorn workers
- Set up HTTPS/SSL
- Configure CORS for production domain

### Frontend
- Build optimized production bundle: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Update `NEXT_PUBLIC_API_URL` environment variable
- Enable CDN for static assets

---

**Status:** ✅ Production-Ready

All calculators are fully functional with accurate financial formulas, professional UI/UX, and optimized performance.
