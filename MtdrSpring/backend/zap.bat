@echo off
REM ==============================
REM Script para correr ZAP en Docker con limpieza y contenedor nombrado
REM ==============================

SET CONTAINER_NAME=zap_scan
SET IMAGE_NAME=ghcr.io/zaproxy/zaproxy:stable

REM Paso 0: Detener y eliminar contenedor anterior si existe
echo [*] Limpiando contenedor anterior...
docker rm -f %CONTAINER_NAME% >nul 2>&1

REM Paso 1: Eliminar imagen anterior si existe
echo [*] Eliminando imagen anterior...
docker rmi -f %IMAGE_NAME% >nul 2>&1

REM Paso 2: Descargar la imagen más reciente de ZAP
echo [*] Descargando imagen ZAP stable...
docker pull %IMAGE_NAME%

REM Paso 3: Ejecutar ZAP en modo quick scan con nombre de contenedor
echo [*] Ejecutando ZAP en modo quick scan...
docker run --name %CONTAINER_NAME% -v "%cd%:/zap/wrk/:rw" -t %IMAGE_NAME% ^
    zap.sh -cmd -quickurl http://host.docker.internal:8080 -quickout /zap/wrk/result.xml

REM Paso 4: Verificar que se generó el archivo result.xml
if exist "%cd%\result.xml" (
    echo [*] Escaneo completado. Reporte generado en: %cd%\result.xml
) else (
    echo [!] Error: No se generó result.xml
)

pause
