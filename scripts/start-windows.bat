@echo off
setlocal
cd /d "%~dp0"
set "URL=http://127.0.0.1:8765"

where node >nul 2>nul
if %errorlevel%==0 (
  start "Health Check Slides Server" /min cmd /c "node serve.mjs"
  timeout /t 2 /nobreak >nul
  start "" "%URL%"
  exit /b 0
)

where py >nul 2>nul
if %errorlevel%==0 (
  start "Health Check Slides Server" /min cmd /c "py -m http.server 8765"
  timeout /t 2 /nobreak >nul
  start "" "%URL%"
  exit /b 0
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "Health Check Slides Server" /min cmd /c "python -m http.server 8765"
  timeout /t 2 /nobreak >nul
  start "" "%URL%"
  exit /b 0
)

echo Node.js or Python was not found. Opening index.html directly.
start "" "%~dp0..\public\index.html"
pause
