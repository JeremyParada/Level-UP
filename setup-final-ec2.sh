#!/bin/bash

# Script de configuración final para Level-UP en EC2
# Ejecutar como: bash setup-final.sh

echo "🚀 Configurando Level-UP en EC2..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Actualizar configuración de Nginx
echo -e "${YELLOW}📝 Actualizando configuración de Nginx...${NC}"

sudo tee /etc/nginx/sites-available/levelup > /dev/null <<'EOF'
server {
    listen 80;
    server_name level-up-web.duckdns.org;

    # Servir el frontend desde el build de React
    root /home/ubuntu/Level-UP/build;
    index index.html;

    # Configuración para el backend API
    # IMPORTANTE: No usar trailing slash en proxy_pass para preservar el path completo
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts para operaciones largas
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Manejar todas las rutas del frontend (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Página de error personalizada
    error_page 404 /index.html;
    
    # Logs específicos para este sitio
    access_log /var/log/nginx/levelup-access.log;
    error_log /var/log/nginx/levelup-error.log;
}
EOF

# 2. Deshabilitar configuración anterior y habilitar la nueva
echo -e "${YELLOW}🔄 Habilitando nueva configuración...${NC}"
sudo rm -f /etc/nginx/sites-enabled/frontend
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/levelup /etc/nginx/sites-enabled/

# 3. Verificar configuración de Nginx
echo -e "${YELLOW}✅ Verificando configuración de Nginx...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Configuración de Nginx válida${NC}"
else
    echo -e "${RED}❌ Error en configuración de Nginx${NC}"
    exit 1
fi

# 4. Reiniciar Nginx
echo -e "${YELLOW}🔄 Reiniciando Nginx...${NC}"
sudo systemctl restart nginx
echo -e "${GREEN}✅ Nginx reiniciado${NC}"

# 5. Limpiar procesos duplicados de PM2
echo -e "${YELLOW}🧹 Limpiando procesos duplicados de PM2...${NC}"
pm2 delete 1 2>/dev/null || true  # Eliminar webhook-server duplicado (stopped)

# 6. Verificar estado de PM2
echo -e "${YELLOW}📊 Estado de PM2:${NC}"
pm2 list

# 7. Verificar que el backend esté respondiendo
echo -e "${YELLOW}🔍 Verificando backend...${NC}"
sleep 2
if curl -s http://localhost:8080/api/v1/productos > /dev/null; then
    echo -e "${GREEN}✅ Backend respondiendo correctamente${NC}"
else
    echo -e "${RED}⚠️  Backend no responde, verifica los logs con: pm2 logs 'Level-UP Backend'${NC}"
fi

# 8. Mostrar información final
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Configuración completada!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "🌐 Tu aplicación está disponible en:"
echo -e "   ${YELLOW}http://level-up-web.duckdns.org${NC}"
echo ""
echo -e "🔧 Endpoints del backend:"
echo -e "   ${YELLOW}http://level-up-web.duckdns.org/api/v1/productos${NC}"
echo -e "   ${YELLOW}http://level-up-web.duckdns.org/api/v1/auth/login${NC}"
echo ""
echo -e "📝 Comandos útiles:"
echo -e "   Ver logs de Nginx:    ${YELLOW}sudo tail -f /var/log/nginx/levelup-error.log${NC}"
echo -e "   Ver logs de backend:  ${YELLOW}pm2 logs 'Level-UP Backend'${NC}"
echo -e "   Ver logs de webhook:  ${YELLOW}pm2 logs webhook-server${NC}"
echo -e "   Estado de PM2:        ${YELLOW}pm2 status${NC}"
echo ""
echo -e "🔄 Para probar el webhook, haz un push a tu repositorio:"
echo -e "   ${YELLOW}git push origin main${NC}"
echo ""
