```bash
#!/bin/bash

# Script de despliegue automático Level-UP
LOG_FILE=~/Level-UP/deploy.log
echo "===== Deploy iniciado: $(date) =====" >> $LOG_FILE

# Ir al directorio del proyecto
cd ~/Level-UP

# Hacer pull de cambios
echo "Pulling changes from GitHub..." >> $LOG_FILE
git pull origin main >> $LOG_FILE 2>&1

# Backend (Spring Boot)
echo "Rebuilding backend..." >> $LOG_FILE
cd backend
./mvnw clean package -DskipTests >> $LOG_FILE 2>&1

# Reiniciar backend con PM2
pm2 restart Level-UP Backend || pm2 start "java -jar target/backend-0.0.1-SNAPSHOT.jar" --name Level-UP Backend
echo "Backend restarted" >> $LOG_FILE

# Frontend (React)
echo "Rebuilding frontend..." >> $LOG_FILE
cd ..
npm install >> $LOG_FILE 2>&1
npm run build >> $LOG_FILE 2>&1

# Servir frontend con PM2 (usando serve)
pm2 restart Level-UP Frontend || pm2 start "npx serve -s build -l 3000" --name Level-UP Frontend
echo "Frontend restarted" >> $LOG_FILE

# Guardar configuración PM2
pm2 save

echo "===== Deploy completado: $(date) =====" >> $LOG_FILE
echo "Deployment successful!"
```

```bash
# Dar permisos
chmod +x ~/Level-UP/deploy.sh
```
