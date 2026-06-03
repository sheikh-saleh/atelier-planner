@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d D:\DAILY_ROUTINE_PROJECT
npm run dev > dev-output.log 2>&1
