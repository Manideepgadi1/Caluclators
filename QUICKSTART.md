# 🚀 Quick Start Guide - Financial Calculators

## ⚡ Fastest Way to Run (Windows)

**Just double-click:** `start-all.bat`

That's it! Both servers will start automatically.

---

## 🌐 Access Points

Once running:

- **🖥 Frontend App:** http://localhost:3000
- **⚙️ Backend API:** http://localhost:8000
- **📚 API Documentation:** http://localhost:8000/docs

---

## 📋 What You Get

### Life Goal Calculators
1. **🪑 Retirement Planning** - Calculate retirement corpus needed
2. **🏫 Child Education** - Plan for education expenses
3. **💒 Marriage Planning** - Save for marriage expenses
4. **🎯 Custom Goals** - Any financial goal

### Financial Calculators
5. **📈 SIP Growth** - See your SIP investments grow
6. **💰 SIP Need** - Calculate monthly SIP needed
7. **⏰ SIP Delay Cost** - Cost of delaying investments
8. **💸 SWP Calculator** - Plan systematic withdrawals

### Quick Tools
9. **💵 Single Amount** - Present/Future value calculator
10. **📊 Irregular Cash Flow** - Complex cash flow analysis
11. **⚖️ Weighted Returns** - Portfolio return calculator

---

## 🔧 Manual Start (if needed)

### Backend (Terminal 1):
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 Test It Out

Try these sample calculations:

### Retirement Planning
- Age: 30 → 60
- Monthly Expenses: ₹50,000
- Returns: 12%
- See your retirement corpus!

### SIP Growth
- Monthly: ₹10,000
- Period: 10 years
- Returns: 12%
- Watch your wealth grow!

### Single Amount
- Amount: ₹1,00,000
- Years: 5
- Inflation: 8%
- See future value!

---

## 🎯 Features

✅ Real-time calculations
✅ Indian currency format (₹)
✅ Interactive sliders
✅ Professional UI
✅ Mobile responsive
✅ Accurate formulas

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check Python 3.11+ installed
- Run: `pip install -r requirements.txt`

**Frontend won't start?**
- Check Node.js 18+ installed
- Run: `npm install` in frontend folder

**Can't access?**
- Backend must be on port 8000
- Frontend must be on port 3000
- Check firewalls/antivirus

---

## 📞 Quick Commands

```bash
# Install backend
cd backend && pip install -r requirements.txt

# Install frontend
cd frontend && npm install

# Run backend
cd backend && uvicorn app.main:app --reload

# Run frontend
cd frontend && npm run dev

# Build for production
cd frontend && npm run build
```

---

## 🎓 Project Structure

```
Caluclators/
├── backend/          # Python FastAPI
├── frontend/         # Next.js + React
├── start-all.bat     # 👈 CLICK THIS!
└── README.md
```

---

## ✨ That's It!

You now have a **production-ready financial calculators platform** running locally!

**Enjoy calculating! 🎉**
