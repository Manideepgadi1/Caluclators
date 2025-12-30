@echo off
echo ========================================
echo Financial Calculators - Full Stack App
echo ========================================
echo.
echo Starting both Backend and Frontend...
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause

start "Backend Server" cmd /k "%~dp0start-backend.bat"
timeout /t 3 >nul
start "Frontend App" cmd /k "%~dp0start-frontend.bat"

echo.
echo ========================================
echo Both servers are starting...
echo Check the opened windows for details
echo ========================================
