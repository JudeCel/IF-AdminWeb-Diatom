@echo off
for /f "tokens=* delims=" %%i in ('dir /s /b /a:d node_modules\mf-*') do rd /s /q "%%i"
npm install
