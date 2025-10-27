const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const extract = require('extract-zip');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '../../');
const instantClientLinux = path.join(rootDir, 'instantclient_linux');
const instantClientWindows = path.join(rootDir, 'instantclient_windows');

const platform = os.platform();

console.log(`🔧 Configurando Oracle Instant Client para ${platform}...`);

let instantClientPath;
let downloadUrl;
let outputZip;

if (platform === 'linux') {
  instantClientPath = instantClientLinux;
  downloadUrl = 'https://download.oracle.com/otn_software/linux/instantclient/2119000/instantclient-basic-linux.x64-21.19.0.0.0dbru.zip';
  outputZip = path.join(rootDir, 'instantclient-linux.zip');
} else if (platform === 'win32') {
  instantClientPath = instantClientWindows;
  downloadUrl = 'https://download.oracle.com/otn_software/nt/instantclient/2119000/instantclient-basic-windows.x64-21.19.0.0.0dbru.zip';
  outputZip = path.join(rootDir, 'instantclient-windows.zip');
} else {
  console.error('❌ Sistema operativo no soportado. Solo Linux y Windows están soportados.');
  process.exit(1);
}

// Descargar y descomprimir el Instant Client
async function setupInstantClient() {
  if (fs.existsSync(instantClientPath)) {
    console.log(`✅ Oracle Instant Client ya está configurado en: ${instantClientPath}`);
    configureEnvironmentVariable();
    return;
  }

  console.log(`⬇️ Descargando Oracle Instant Client desde: ${downloadUrl}`);
  await downloadFile(downloadUrl, outputZip);
  console.log(`Archivo descargado: ${outputZip}`);

  console.log(`📦 Descomprimiendo Oracle Instant Client en: ${instantClientPath}`);
  await extract(outputZip, { dir: rootDir });

  // Renombrar la carpeta descomprimida
  const extractedFolder = fs.readdirSync(rootDir).find((folder) =>
    folder.startsWith('instantclient')
  );
  if (extractedFolder) {
    fs.renameSync(path.join(rootDir, extractedFolder), instantClientPath);
  }

  // Eliminar el archivo ZIP
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
  } else {
    console.error(`❌ Archivo ZIP no encontrado: ${outputZip}`);
  }

  console.log(`✅ Oracle Instant Client configurado en: ${instantClientPath}`);
  configureEnvironmentVariable();
}

// Configurar la variable de entorno
function configureEnvironmentVariable() {
  if (platform === 'linux') {
    const bashrcPath = path.join(os.homedir(), '.bashrc');
    const exportCommand = `export LD_LIBRARY_PATH=${instantClientPath}:$LD_LIBRARY_PATH`;

    if (!fs.readFileSync(bashrcPath, 'utf8').includes(exportCommand)) {
      fs.appendFileSync(bashrcPath, `\n# Configuración de Oracle Instant Client\n${exportCommand}\n`);
      console.log(`✅ Variable de entorno LD_LIBRARY_PATH configurada en ${bashrcPath}`);
    }

    // Aplicar la configuración en la sesión actual
    execSync(`export LD_LIBRARY_PATH=${instantClientPath}:$LD_LIBRARY_PATH`);
  } else if (platform === 'win32') {
    const setxCommand = `setx PATH "%PATH%;${instantClientPath}"`;
    execSync(setxCommand, { stdio: 'inherit' });
    console.log(`✅ Variable de entorno PATH configurada en Windows`);
  }
}

// Descargar un archivo desde una URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️ Iniciando descarga desde: ${url}`);
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ Error al descargar el archivo: Código de estado ${response.statusCode}`);
        reject(new Error(`Error al descargar el archivo: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.existsSync(dest)) {
            console.log(`✅ Archivo descargado correctamente: ${dest}`);
            resolve();
          } else {
            console.error(`❌ Archivo no encontrado después de la descarga: ${dest}`);
            reject(new Error(`Archivo no encontrado después de la descarga: ${dest}`));
          }
        });
      });
    }).on('error', (err) => {
      console.error(`❌ Error durante la descarga: ${err.message}`);
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Ejecutar el script
setupInstantClient().catch((err) => {
  console.error('❌ Error al configurar Oracle Instant Client:', err.message);
  process.exit(1);
});