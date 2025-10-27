const fs = require('fs');
const path = require('path');
const os = require('os');

const rootDir = path.resolve(__dirname, '../../');
const instantClientLinux = path.join(rootDir, 'instantclient_linux');
const instantClientWindows = path.join(rootDir, 'instantclient_windows');

const platform = os.platform();

console.log(`🔧 Configurando Oracle Instant Client para ${platform}...`);

let instantClientPath;

if (platform === 'linux') {
  instantClientPath = instantClientLinux;
} else if (platform === 'win32') {
  instantClientPath = instantClientWindows;
} else {
  console.error('❌ Sistema operativo no soportado. Solo Linux y Windows están soportados.');
  process.exit(1);
}

if (!fs.existsSync(instantClientPath)) {
  console.error(`❌ No se encontró el Instant Client en: ${instantClientPath}`);
  process.exit(1);
}

// Configurar la variable de entorno ORACLE_CLIENT_LIB
process.env.ORACLE_CLIENT_LIB = instantClientPath;

console.log(`✅ Oracle Instant Client configurado en: ${instantClientPath}`);