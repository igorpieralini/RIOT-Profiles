@echo off
echo ========================================
echo   RIOT Profiles - Ser Localrvido
echo ========================================
echo.
echo Iniciando servidor em http://localhost:8000
echo Pressione Ctrl+C para parar
echo.
cd /d "%~dp0public"
php -S localhost:8000
pause
