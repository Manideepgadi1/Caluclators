#!/bin/bash
# Quick deployment script - run this on VPS

cd /var/www/vsfintech/Investment-Calculator
git pull origin main
chmod -R 755 /var/www/vsfintech/Investment-Calculator
bash /var/www/vsfintech/Investment-Calculator/deploy-financial-calculators-safe.sh
