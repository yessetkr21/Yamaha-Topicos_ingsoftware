@echo off
echo ========================================
echo   Yamaha Motos - Ecommerce
echo ========================================
echo.
echo Iniciando aplicacion en http://localhost:8000
echo.

docker-compose up -d

echo.
echo ========================================
echo   Aplicacion iniciada!
echo ========================================
echo.
echo Accede a: http://localhost:8000
echo Admin: http://localhost:8000/admin
echo.
echo Para ver logs: docker-compose logs -f
echo Para detener: ejecuta STOP.bat
echo.
pause
