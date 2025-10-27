const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 4000;
const SECRET = 'Level-Up'; // Usa el mismo secreto que configuraste en GitHub

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
              'cd /home/ubuntu/Level-UP/backend && npm install && pm2 restart "Level-UP Backend"',
              'Actualizar dependencias y reiniciar el backend',
              (err) => {
                if (err) return;

                ejecutarComando(
                  'cd /home/ubuntu/Level-UP && sudo chown -R ubuntu:ubuntu build',
                  'Cambiar permisos del directorio build (ubuntu)',
                  (err) => {
                    if (err) return;

                    ejecutarComando(
                      'cd /home/ubuntu/Level-UP && npm install && npm run build',
                      'Construir el proyecto',
                      (err) => {
                        if (err) return;

                        ejecutarComando(
                          'cd /home/ubuntu/Level-UP && sudo chown -R www-data:www-data build',
                          'Cambiar permisos del directorio build (www-data)',
                          (err) => {
                            if (err) return;

                            ejecutarComando(
                              'sudo systemctl restart nginx',
                              'Reiniciar Nginx',
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
