@echo off
echo ========================================
echo Push to GitHub and Deploy to VPS
echo ========================================
echo.

REM Step 1: Push to GitHub
echo [1/2] Pushing changes to GitHub...
cd /d d:\Caluclators
git add .
set /p commit_msg="Enter commit message (or press Enter for 'Update'): "
if "%commit_msg%"=="" set commit_msg=Update

git commit -m "%commit_msg%"
if errorlevel 1 (
    echo No changes to commit or commit failed
) else (
    echo Committed: %commit_msg%
)

git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)
echo Successfully pushed to GitHub!
echo.

REM Step 2: Update VPS
echo [2/2] Updating VPS...
echo Connecting to 82.25.105.18...
echo.

ssh root@82.25.105.18 "cd /var/www/vsfintech/Investment-Calculator && git pull origin main && cd frontend && rm -rf .next && npm run build && cd .. && pm2 stop investment-calculator-backend investment-calculator-frontend || true && pm2 delete investment-calculator-backend investment-calculator-frontend || true && cd backend && pm2 start 'venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 5003' --name investment-calculator-backend && cd ../frontend && pm2 start npm --name investment-calculator-frontend -- start && pm2 save && sleep 2 && pm2 list"

if errorlevel 1 (
    echo.
    echo ERROR: VPS update failed
    echo Please check your SSH connection and try again
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your changes have been:
echo   1. Pushed to GitHub
echo   2. Pulled on VPS
echo   3. Containers rebuilt and restarted
echo.
pause
