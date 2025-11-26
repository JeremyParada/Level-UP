#!/bin/bash

# ============================================
# Script de Despliegue Automático - Level-UP
# ============================================

# Configuración
PROJECT_DIR=~/Level-UP
LOG_FILE=~/Level-UP/deploy.log
BACKEND_JAR=~/Level-UP/backend/target/backend-0.0.1-SNAPSHOT.jar

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "===== Inicio del despliegue ====="

# Navegar al directorio del proyecto
cd $PROJECT_DIR || { log "ERROR: No se pudo acceder al directorio del proyecto"; exit 1; }

# Pull de cambios desde GitHub
log "Obteniendo cambios desde GitHub..."
git pull origin main >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Git pull falló"
    exit 1
fi

log "Cambios obtenidos exitosamente"

# =========================
# BACKEND (Spring Boot)
# =========================
log "Construyendo backend..."
cd backend

# Limpiar y construir
./mvnw clean package -DskipTests >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Build del backend falló"
    exit 1
fi

log "Backend construido exitosamente"

# Reiniciar con PM2
log "Reiniciando backend..."
pm2 describe levelup-backend > /dev/null 2>&1
if [ $? -eq 0 ]; then
    # Ya existe, reiniciar
    pm2 restart levelup-backend
    log "Backend reiniciado"
else
    # No existe, crear
    # Eliminar cualquier proceso duplicado antes de crear el backend
    pm2 delete levelup-backend > /dev/null 2>&1
    pm2 delete "Level-UP Backend" > /dev/null 2>&1
    pm2 start "java -jar $BACKEND_JAR" --name levelup-backend
    log "Backend iniciado por primera vez"
fi

# =========================
# FRONTEND (React)
# =========================
log "Construyendo frontend..."
cd $PROJECT_DIR

# Instalar dependencias (solo si package.json cambió)
if git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep -q "package.json"; then
    log "package.json cambió, instalando dependencias..."
    npm install >> $LOG_FILE 2>&1
fi

# Verificar y corregir permisos de la carpeta build si existe
if [ -d "$PROJECT_DIR/build" ]; then
    log "Corrigiendo permisos de la carpeta build..."
    sudo chown -R ubuntu:ubuntu $PROJECT_DIR/build
    sudo chmod -R 755 $PROJECT_DIR/build
fi

# Build de producción
rm -rf $PROJECT_DIR/build
log "Generando build de producción..."
NODE_OPTIONS="--max_old_space_size=1024" npm run build >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "ERROR: Build del frontend falló"
    exit 1
fi

log "Frontend construido exitosamente"

# Reiniciar con PM2
log "Reiniciando frontend..."
pm2 describe levelup-frontend > /dev/null 2>&1
if [ $? -eq 0 ]; then
    pm2 restart levelup-frontend
    log "Frontend reiniciado"
else
    pm2 start "npx serve -s build -l 3000" --name levelup-frontend
    log "Frontend iniciado por primera vez"
fi

# =========================
# FINALIZACIÓN
# =========================

# Guardar configuración PM2
pm2 save

# Mostrar estado
log "Estado de los procesos:"
pm2 status

log "===== Despliegue completado exitosamente ====="
log ""

# Mostrar URLs
echo ""
echo "✅ Aplicación desplegada exitosamente!"
echo "📱 Frontend: http://levelup-gamer.duckdns.org"
echo "🔧 Backend API: http://levelup-gamer.duckdns.org:8080/api/v1"
echo "📊 Logs: tail -f $LOG_FILE"
echo ""
