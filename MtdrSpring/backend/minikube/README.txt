COPY WALLET HERE
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
minikube image load agileimage:0.1
kubectl get secret dbuser -n mtdrworkshop --template={{.data.db_password}} #lin
kubectl get secret dbuser -n mtdrworkshop -o jsonpath="{.data.db_password}" #win