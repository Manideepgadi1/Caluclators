@echo off
echo ========================================
echo Updating VPS Deployment
echo ========================================
echo.

REM Push latest changes to GitHub (if any)
echo Step 1: Pushing to GitHub...
cd /d d:\Caluclators
git add .
git commit -m "Update deployment" 2>nul
git push origin main
echo.

REM SSH and update VPS
echo Step 2: Connecting to VPS and updating...
echo.
echo Run these commands on your VPS:
echo ----------------------------------------
echo cd /var/www/financial-calculators
echo git pull origin main
echo docker-compose up -d --build
echo ----------------------------------------
echo.

REM Connect to VPS
ssh root@82.25.105.18 "cd /var/www/financial-calculators && git pull origin main && docker-compose up -d --build"

echo.
echo ========================================
echo Update Complete!
echo ========================================
pause
