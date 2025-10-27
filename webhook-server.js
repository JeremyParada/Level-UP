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
        exec(
          `
          cd /home/ubuntu/Level-UP &&
          git reset --hard &&
          git pull origin main &&
          cd backend &&
          npm install &&
          pm2 restart "Level-UP Backend" &&
          cd ../ &&
          npm install &&
          npm run build
          `,
          (err, stdout, stderr) => {
            if (err) {
              console.error('❌ Error al actualizar el servidor:', stderr);
              return;
            }
            console.log('✅ Servidor actualizado con éxito:', stdout);
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
