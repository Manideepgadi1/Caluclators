@echo off
echo ========================================
echo Financial Calculators - Frontend App
echo ========================================
echo.

cd frontend

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo ========================================
echo Starting Next.js Development Server
echo ========================================
echo Frontend: http://localhost:3000
echo.

call npm run dev
