@echo off
echo Deteniendo Minikube...
minikube stop

echo Eliminando Minikube...
minikube delete

echo Iniciando Minikube...
minikube start

echo Aplicando configuración desde win-TomaTask-springboot.yaml...
kubectl apply -f win-TomaTask-springboot.yaml

echo Ejecutando scripts adicionales...
powershell -ExecutionPolicy Bypass -File .\nm.ps1
powershell -ExecutionPolicy Bypass -File .\wallet2k8s.ps1
powershell -ExecutionPolicy Bypass -File .\dbpass.ps1
powershell -ExecutionPolicy Bypass -File .\deploy.ps1

echo Proceso completado.
pause
