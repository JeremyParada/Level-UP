# 🚀 Pasos Finales de Configuración - Level-UP

## ✅ Lo que ya tienes configurado:
- ✅ DuckDNS funcionando: `level-up-web.duckdns.org`
- ✅ Puerto 4000 abierto en EC2
- ✅ PM2 corriendo backend y webhook
- ✅ Nginx instalado

---

## 📋 Pasos para completar la configuración

### Paso 1: Subir archivos a tu repositorio

Desde tu PC local, ejecuta:

```bash
cd C:\Users\jeremy.parada\Desktop\Level-UP

# Agregar los archivos nuevos
git add .env.production
git add setup-final-ec2.sh
git add webhook-server.js

# Commit
git commit -m "Add production config and deployment scripts"

# Push
git push origin main
```

### Paso 2: Conectarte a tu EC2

```bash
ssh -i "tu-clave.pem" ubuntu@<IP-DE-TU-EC2>
```

### Paso 3: Actualizar el repositorio en EC2

```bash
cd ~/Level-UP
git pull origin main
```

### Paso 4: Ejecutar el script de configuración

```bash
# Dar permisos de ejecución
chmod +x setup-final-ec2.sh

# Ejecutar el script
bash setup-final-ec2.sh
```

Este script hará automáticamente:
- ✅ Actualizar la configuración de Nginx con los paths correctos
- ✅ Eliminar configuraciones antiguas
- ✅ Limpiar procesos duplicados de PM2
- ✅ Verificar que todo esté funcionando
- ✅ Mostrar información de tu deployment

---

## 🔍 Verificación

Después de ejecutar el script, verifica que todo funcione:

### 1. Verificar Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

### 2. Verificar PM2
```bash
pm2 status
pm2 logs "Level-UP Backend" --lines 20
```

### 3. Probar el backend directamente
```bash
curl http://localhost:8080/api/v1/productos
```

### 4. Probar a través de Nginx
```bash
curl http://level-up-web.duckdns.org/api/v1/productos
```

### 5. Abrir en el navegador
Visita: `http://level-up-web.duckdns.org`

---

## 🔧 Configurar el Webhook de GitHub

### Paso 1: Ir a tu repositorio en GitHub
1. Ve a `Settings` → `Webhooks` → `Add webhook`

### Paso 2: Configurar el webhook
- **Payload URL:** `http://level-up-web.duckdns.org:4000/webhook`
- **Content type:** `application/json`
- **Secret:** `Level-Up` (el mismo que está en webhook-server.js)
- **Which events:** Selecciona "Just the push event"
- **Active:** ✅ Marcado

### Paso 3: Guardar
Click en "Add webhook"

### Paso 4: Probar el webhook
Haz un pequeño cambio en tu código y haz push:

```bash
# En tu PC local
git add .
git commit -m "Test webhook"
git push origin main
```

Luego verifica en EC2:
```bash
pm2 logs webhook-server
```

Deberías ver logs indicando que recibió el webhook y ejecutó el deployment.

---

## 🐛 Troubleshooting

### Problema: Nginx muestra error 502 Bad Gateway
```bash
# Verificar que el backend esté corriendo
pm2 status
pm2 logs "Level-UP Backend"

# Verificar que el puerto 8080 esté escuchando
sudo netstat -tuln | grep 8080
```

### Problema: El webhook no se activa
```bash
# Verificar logs del webhook
pm2 logs webhook-server

# Verificar que el puerto 4000 esté escuchando
sudo netstat -tuln | grep 4000

# Reiniciar el webhook server
pm2 restart webhook-server
```

### Problema: Frontend no carga
```bash
# Verificar que el build existe
ls -la ~/Level-UP/build

# Si no existe, construir manualmente
cd ~/Level-UP
npm install
npm run build

# Verificar permisos
sudo chown -R www-data:www-data ~/Level-UP/build
```

### Problema: API calls fallan desde el frontend
```bash
# Verificar logs de Nginx
sudo tail -f /var/log/nginx/levelup-error.log

# Verificar que el proxy_pass esté correcto
sudo cat /etc/nginx/sites-available/levelup | grep proxy_pass
```

---

## 📊 Comandos útiles

```bash
# Ver todos los logs en tiempo real
pm2 logs

# Ver logs específicos
pm2 logs "Level-UP Backend"
pm2 logs webhook-server

# Reiniciar servicios
pm2 restart "Level-UP Backend"
sudo systemctl restart nginx

# Ver estado de servicios
pm2 status
sudo systemctl status nginx

# Ver uso de recursos
pm2 monit
```

---

## 🎯 URLs Finales

Una vez completada la configuración:

- **Frontend:** http://level-up-web.duckdns.org
- **Backend API:** http://level-up-web.duckdns.org/api/v1/productos
- **Login:** http://level-up-web.duckdns.org/api/v1/auth/login
- **Webhook:** http://level-up-web.duckdns.org:4000/webhook

---

## ⚠️ Nota importante sobre AWS Academy

Cada vez que inicies un nuevo laboratorio de AWS Academy:

1. **La IP cambiará** → DuckDNS se actualizará automáticamente (cada 5 min)
2. **Security Groups se resetean** → Debes volver a abrir los puertos:
   - Puerto 22 (SSH)
   - Puerto 80 (HTTP)
   - Puerto 4000 (Webhook)
   - Puerto 8080 (Backend - solo si quieres acceso directo)

3. **PM2 debería auto-iniciar** → Verifica con `pm2 status`

### Script rápido de reconfiguración:
```bash
# Verificar IP actual
curl ifconfig.me

# Actualizar DuckDNS manualmente (si es necesario)
~/duckdns/duck.sh

# Verificar PM2
pm2 status

# Si PM2 no está corriendo
pm2 resurrect
```

---

¡Listo! Tu aplicación estará funcionando con auto-deployment 🎉
