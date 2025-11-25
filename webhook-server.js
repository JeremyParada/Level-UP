const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 4000;
const SECRET = 'Level-Up';

// Verificar la firma del webhook
function verifySignature(req, body) {
  const signature = `sha256=${crypto
    .createHmac('sha256', SECRET)
    .update(body)
    .digest('hex')}`;
  const headerSignature = req.headers['x-hub-signature-256'];

  console.log('Generated Signature:', signature);
  console.log('Header Signature:', headerSignature);

  if (!headerSignature) {
    console.error('❌ No se recibió el encabezado X-Hub-Signature-256');
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(headerSignature));
}

// Ejecutar un comando con logs
function ejecutarComando(comando, descripcion, callback) {
  console.log(`🔄 Ejecutando: ${descripcion}`);
  exec(comando, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error en "${descripcion}":`, stderr);
      callback(err);
      return;
    }
    console.log(`✅ Completado: ${descripcion}`);
    console.log(stdout);
    callback(null);
  });
}

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!verifySignature(req, body)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Invalid signature');
        return;
      }

      const payload = JSON.parse(body);
      if (payload.ref === 'refs/heads/main') {
        console.log('🔄 Recibiendo cambios del repositorio...');

        // Ejecutar los comandos uno por uno
        ejecutarComando(
          'cd /home/ubuntu/Level-UP && git reset --hard && git pull origin main',
          'Actualizar el repositorio',
          (err) => {
            if (err) return;

            ejecutarComando(
              'cd /home/ubuntu/Level-UP/backend && chmod +x mvnw && ./mvnw clean package -DskipTests',
              'Compilar el backend',
              (err) => {
                if (err) return;

                ejecutarComando(
                  'pm2 restart "Level-UP Backend" || pm2 start "java -jar /home/ubuntu/Level-UP/backend/target/backend-0.0.1-SNAPSHOT.jar" --name "Level-UP Backend"',
                  'Reiniciar el backend',
                  (err) => {
                    if (err) return;

                    ejecutarComando(
                      'cd /home/ubuntu/Level-UP && npm cache clean --force && sudo rm -rf build',
                      'Limpiar caché y eliminar build anterior',
                      (err) => {
                        if (err) return;

                        ejecutarComando(
                          'cd /home/ubuntu/Level-UP && npm run build',
                          'Construir el frontend',
                          (err) => {
                            if (err) return;

                            ejecutarComando(
                              'sudo chown -R www-data:www-data /home/ubuntu/Level-UP/build && sudo systemctl restart nginx',
                              'Actualizar permisos y reiniciar Nginx',
                              (err) => {
                                if (err) return;

                                console.log('🚀 Actualización completada con éxito.');
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Webhook recibido');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${PORT}`);
});
