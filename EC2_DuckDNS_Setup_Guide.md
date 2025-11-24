# Guía Completa: DuckDNS + EC2 + PM2 + GitHub Auto-Deploy

## 📋 Requisitos Previos
- Instancia EC2 corriendo (AWS Academy)
- Acceso SSH a la EC2
- PM2 instalado
- Git configurado en EC2
- Node.js y Java instalados en EC2

---

## Paso 1: Configurar DuckDNS (5 minutos)

### 1.1 Crear cuenta en DuckDNS
1. Ve a https://www.duckdns.org/
2. Inicia sesión con Google, GitHub o Twitter
3. Crea un subdominio (ejemplo: `levelup-gamer`)
   - Tu dominio será: `levelup-gamer.duckdns.org`
4. **Copia tu TOKEN** (aparece en la página principal)

### 1.2 Conectarse a tu EC2
```bash
# Desde tu PC local (PowerShell)
ssh -i "tu-clave.pem" ec2-user@<IP-ACTUAL-DE-TU-EC2>
```

### 1.3 Instalar DuckDNS en EC2
```bash
# Crear directorio para DuckDNS
mkdir ~/duckdns
cd ~/duckdns

# Crear script de actualización
echo url="https://www.duckdns.org/update?domains=levelup-gamer&token=TU_TOKEN_AQUI&ip=" | curl -k -o ~/duckdns/duck.sh -K -

# Dar permisos de ejecución
chmod 700 duck.sh

# Probar el script
./duck.sh
```

**Salida esperada:** `OK` (significa que funcionó)

### 1.4 Automatizar con Cron (actualiza cada 5 minutos)
```bash
# Editar crontab
crontab -e

# Presiona 'i' para insertar, luego agrega esta línea:
*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1

# Guardar: ESC, luego :wq, ENTER
```

### 1.5 Verificar que funciona
```bash
# Espera 5 minutos y verifica
curl https://www.duckdns.org/update?domains=levelup-gamer&token=TU_TOKEN&verbose=true

# También prueba con ping
ping levelup-gamer.duckdns.org
```

---

## Paso 2: Configurar Security Groups en EC2

### 2.1 Abrir puertos necesarios
En AWS Console → EC2 → Security Groups:

**Reglas de Entrada (Inbound Rules):**
```
Puerto 22   (SSH)          - 0.0.0.0/0
Puerto 80   (HTTP)         - 0.0.0.0/0
Puerto 443  (HTTPS)        - 0.0.0.0/0
Puerto 3000 (React)        - 0.0.0.0/0
Puerto 8080 (Spring Boot)  - 0.0.0.0/0
```

💡 **Nota AWS Academy:** Los Security Groups se resetean al crear nuevo laboratorio, deberás configurarlos cada vez.

---

## Paso 3: Configurar PM2 para Auto-Deploy

### 3.1 Estructura recomendada en EC2
```bash
# Navegar a tu proyecto
cd ~
mkdir -p levelup-gamer
cd levelup-gamer

# Clonar repositorio (primera vez)
git clone https://github.com/TU_USUARIO/Level-UP.git
cd Level-UP
```

### 3.2 Crear script de despliegue
```bash
# Crear deploy.sh
nano ~/levelup-gamer/deploy.sh
```

**Contenido del script:**
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

### 3.3 Configurar PM2 Ecosystem (opcional pero recomendado)
```bash
# Crear ecosystem.config.js
nano ~/levelup-gamer/Level-UP/ecosystem.config.js
```

**Contenido:**
```javascript
module.exports = {
  apps: [
    {
      name: 'levelup-backend',
      cwd: './backend',
      script: 'java',
      args: '-jar target/backend-0.0.1-SNAPSHOT.jar',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: '~/levelup-gamer/logs/backend-error.log',
      out_file: '~/levelup-gamer/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      watch: false
    },
    {
      name: 'levelup-frontend',
      cwd: './',
      script: 'npx',
      args: 'serve -s build -l 3000',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '~/levelup-gamer/logs/frontend-error.log',
      out_file: '~/levelup-gamer/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      watch: false
    }
  ]
};
```

**Iniciar con ecosystem:**
```bash
cd ~/levelup-gamer/Level-UP
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Configurar auto-inicio
```

---

## Paso 4: Configurar GitHub Webhook (Auto-Deploy al hacer push)

### 4.1 Configurar endpoint webhook en EC2

**Opción A: Usar PM2 + webhook (más fácil)**
```bash
# Instalar pm2-webhook
npm install -g pm2-webhook

# Crear configuración webhook
nano ~/webhook-config.json
```

**Contenido:**
```json
{
  "port": 9000,
  "hooks": [
    {
      "method": "POST",
      "path": "/webhook/deploy",
      "execute": "~/levelup-gamer/deploy.sh"
    }
  ]
}
```

```bash
# Iniciar webhook con PM2
pm2 start pm2-webhook -- --config ~/webhook-config.json --port 9000
pm2 save
```

**Opción B: Script Node.js manual**
```bash
nano ~/webhook-server.js
```

```javascript
const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const PORT = 9000;
const DEPLOY_SCRIPT = '/home/ec2-user/levelup-gamer/deploy.sh';

// Secret para validar webhook (opcional)
const WEBHOOK_SECRET = 'tu-secret-aqui';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook/deploy') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Webhook received, executing deploy...');
      
      exec(DEPLOY_SCRIPT, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          res.writeHead(500);
          res.end('Deploy failed');
          return;
        }
        
        console.log(`Deploy output: ${stdout}`);
        res.writeHead(200);
        res.end('Deploy triggered successfully');
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
```

```bash
# Iniciar con PM2
pm2 start webhook-server.js --name webhook
pm2 save
```

### 4.2 Configurar en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Webhooks** → **Add webhook**
3. Configurar:
   - **Payload URL:** `http://levelup-gamer.duckdns.org:9000/webhook/deploy`
   - **Content type:** `application/json`
   - **Secret:** (opcional, el que definiste)
   - **Events:** Just the `push` event
   - **Active:** ✅ marcado
4. **Add webhook**

### 4.3 Abrir puerto webhook en Security Group
```
Puerto 9000 - 0.0.0.0/0 (para GitHub webhook)
```

---

## Paso 5: Actualizar Configuración Frontend

### 5.1 Actualizar .env para producción
```bash
# Crear .env.production en tu proyecto local
nano .env.production
```

**Contenido:**
```bash
# Producción con DuckDNS
REACT_APP_API_URL=http://levelup-gamer.duckdns.org:8080/api
```

### 5.2 Commit y push
```bash
git add .env.production
git commit -m "Add production environment with DuckDNS"
git push origin main
```

El webhook se activará automáticamente y desplegará los cambios! 🎉

---

## Paso 6: Nginx como Reverse Proxy (Opcional pero Recomendado)

### 6.1 Instalar Nginx
```bash
sudo yum update -y
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6.2 Configurar Nginx
```bash
sudo nano /etc/nginx/conf.d/levelup.conf
```

**Contenido:**
```nginx
# Frontend
server {
    listen 80;
    server_name levelup-gamer.duckdns.org;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Verificar configuración
sudo nginx -t

# Reiniciar nginx
sudo systemctl restart nginx
```

**Actualizar .env.production:**
```bash
# Ahora usa puerto 80 (sin especificar puerto)
REACT_APP_API_URL=http://levelup-gamer.duckdns.org/api
```

---

## ✅ Checklist de Verificación

- [ ] DuckDNS configurado y respondiendo
- [ ] Cron actualiza IP cada 5 minutos
- [ ] Security Groups permiten tráfico en puertos necesarios
- [ ] PM2 corriendo backend y frontend
- [ ] Script deploy.sh funciona manualmente
- [ ] Webhook GitHub configurado
- [ ] Push a GitHub activa auto-deploy
- [ ] Frontend accesible en `http://levelup-gamer.duckdns.org`
- [ ] Backend API responde en `/api/v1/productos`

---

## 🔧 Comandos Útiles PM2

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs levelup-backend
pm2 logs levelup-frontend

# Reiniciar
pm2 restart levelup-backend
pm2 restart all

# Detener
pm2 stop levelup-backend

# Eliminar proceso
pm2 delete levelup-backend

# Guardar configuración actual
pm2 save

# Ver uso de recursos
pm2 monit

# Ver logs de deploy
tail -f ~/levelup-gamer/deploy.log
```

---

## 🐛 Troubleshooting

### Problema: DuckDNS no actualiza IP
```bash
# Verificar manualmente
curl "https://www.duckdns.org/update?domains=levelup-gamer&token=TU_TOKEN&verbose=true"

# Ver logs de cron
grep CRON /var/log/syslog
```

### Problema: Webhook no se activa
```bash
# Ver logs del webhook
pm2 logs webhook

# Verificar puerto abierto
netstat -tuln | grep 9000

# Probar manualmente
curl -X POST http://localhost:9000/webhook/deploy
```

### Problema: PM2 no arranca al reiniciar EC2
```bash
# Reconfigurar startup
pm2 unstartup
pm2 startup
# Ejecutar el comando que te muestra PM2

pm2 save
```

---

## 📝 Notas Importantes AWS Academy

⚠️ **Cada vez que inicies un nuevo laboratorio:**
1. La IP de EC2 cambiará → DuckDNS se actualizará automáticamente ✅
2. Security Groups SE RESETEAN → Debes reconfigurarlos ❌
3. PM2 debería auto-iniciar → Verifica con `pm2 status` ✅

**Script rápido de reconfiguración:**
```bash
# Verificar IP actual
curl ifconfig.me

# Actualizar DuckDNS manualmente
~/duckdns/duck.sh

# Verificar PM2
pm2 status

# Si PM2 no está corriendo
pm2 resurrect
```

---

## 🎯 Resultado Final

Después de configurar todo:
- **Frontend:** http://levelup-gamer.duckdns.org
- **Backend API:** http://levelup-gamer.duckdns.org/api/v1
- **Auto-deploy:** Push a GitHub → Webhook → PM2 reinicia automáticamente

¡Tu aplicación estará siempre accesible con el mismo dominio! 🚀
