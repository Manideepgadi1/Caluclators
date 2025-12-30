@echo off
echo ========================================
echo Financial Calculators - Backend Server
echo ========================================
echo.

cd backend

if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing/Updating dependencies...
pip install -q -r requirements.txt

echo.
echo ========================================
echo Starting FastAPI Server on port 8000
echo ========================================
echo API Docs: http://localhost:8000/docs
echo.

uvicorn app.main:app --reload --port 8000
