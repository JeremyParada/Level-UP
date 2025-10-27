const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const extract = require('extract-zip');
const crypto = require('crypto');
const { execSync } = require('child_process');
const crc = require('crc'); // Importar el paquete crc

const rootDir = path.resolve(__dirname, '../../');
const instantClientLinux = path.join(rootDir, 'instantclient_linux');
const instantClientWindows = path.join(rootDir, 'instantclient_windows');

const platform = os.platform();

console.log(`🔧 Configurando Oracle Instant Client para ${platform}...`);

let instantClientPath;
let downloadUrl;
let outputZip;
let expectedChecksum;

if (platform === 'linux') {
  instantClientPath = instantClientLinux;
  downloadUrl = 'https://download.oracle.com/otn_software/linux/instantclient/2119000/instantclient-basic-linux.x64-21.19.0.0.0dbru.zip';
  outputZip = path.join(rootDir, 'instantclient-linux.zip');
  expectedChecksum = '942346171'; // Checksum esperado para Linux
} else if (platform === 'win32') {
  instantClientPath = instantClientWindows;
  downloadUrl = 'https://download.oracle.com/otn_software/nt/instantclient/2119000/instantclient-basic-windows.x64-21.19.0.0.0dbru.zip';
  outputZip = path.join(rootDir, 'instantclient-windows.zip');
  expectedChecksum = '1453364920'; // Checksum esperado para Windows
} else {
  console.error('❌ Sistema operativo no soportado. Solo Linux y Windows están soportados.');
  process.exit(1);
}

// Archivos necesarios para Oracle Instant Client
const requiredFiles = ['libclntsh.so', 'libocci.so', 'libclntshcore.so'];

// Descargar y descomprimir el Instant Client
async function setupInstantClient() {
  if (fs.existsSync(instantClientPath)) {
    console.log(`✅ Verificando Oracle Instant Client en: ${instantClientPath}`);
    if (checkRequiredFiles(instantClientPath)) {
      console.log(`✅ Todos los archivos necesarios están presentes.`);
      configureEnvironmentVariable();
      return;
    } else {
      console.error(`❌ Faltan archivos necesarios en ${instantClientPath}. Eliminando carpeta...`);
      fs.rmSync(instantClientPath, { recursive: true, force: true });
    }
  }

  console.log(`⬇️ Descargando Oracle Instant Client desde: ${downloadUrl}`);
  await downloadFile(downloadUrl, outputZip);

  console.log(`📋 Verificando checksum del archivo descargado...`);
  const checksum = calculateChecksum(outputZip);
  if (checksum !== expectedChecksum) {
    console.error(`❌ Checksum inválido. Esperado: ${expectedChecksum}, Obtenido: ${checksum}`);
    fs.unlinkSync(outputZip);
    process.exit(1);
  }
  console.log(`✅ Checksum válido: ${checksum}`);

  const fileSize = fs.statSync(outputZip).size;
  console.log(`📋 Tamaño del archivo descargado: ${fileSize} bytes`);
  if (fileSize !== 83544786) {
    console.error(`❌ Tamaño del archivo incorrecto. Esperado: 83544786, Obtenido: ${fileSize}`);
    fs.unlinkSync(outputZip);
    process.exit(1);
  }

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

  if (checkRequiredFiles(instantClientPath)) {
    console.log(`✅ Oracle Instant Client configurado correctamente en: ${instantClientPath}`);
    configureEnvironmentVariable();
  } else {
    console.error(`❌ Faltan archivos necesarios incluso después de la descarga y descompresión.`);
    process.exit(1);
  }
}

// Verificar si los archivos necesarios están presentes
function checkRequiredFiles(directory) {
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(directory, file))) {
      console.error(`❌ Archivo faltante: ${file}`);
      return false;
    }
  }
  return true;
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

// Descargar un archivo desde una URL usando curl
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`⬇️ Iniciando descarga con curl desde: ${url}`);
    const curlCommand = `curl -o ${dest} ${url}`;
    try {
      execSync(curlCommand, { stdio: 'inherit' }); // Ejecutar el comando curl
      if (fs.existsSync(dest)) {
        console.log(`✅ Archivo descargado correctamente: ${dest}`);
        resolve();
      } else {
        console.error(`❌ Archivo no encontrado después de la descarga: ${dest}`);
        reject(new Error(`Archivo no encontrado después de la descarga: ${dest}`));
      }
    } catch (err) {
      console.error(`❌ Error durante la descarga con curl: ${err.message}`);
      reject(err);
    }
  });
}

// Calcular el checksum de un archivo
function calculateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const checksum = crc.crc32(fileBuffer); // Calcular el checksum CRC32
  return checksum >>> 0; // Asegurarse de que el valor sea un entero sin signo
}

// Ejecutar el script
setupInstantClient().catch((err) => {
  console.error('❌ Error al configurar Oracle Instant Client:', err.message);
  process.exit(1);
});