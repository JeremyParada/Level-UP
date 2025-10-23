const oracledb = require('oracledb');
const path = require('path');
require('dotenv').config();

// Configurar wallet de Oracle Cloud
const walletLocation = process.env.TNS_ADMIN || path.join(__dirname, '../../wallet');
const walletPassword = process.env.WALLET_PASSWORD || ''; // Solo si tu wallet tiene password

// Configuración para Oracle Cloud
oracledb.initOracleClient({
  libDir: process.env.ORACLE_CLIENT_LIB || undefined, // Windows: 'C:\\oracle\\instantclient_21_13'
  configDir: walletLocation
});

// Configuración de conexión
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  // Configuración del pool
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
  poolTimeout: 60,
  // Para Oracle Cloud Autonomous Database
  walletLocation: walletLocation,
  walletPassword: walletPassword
};

// Inicializar el pool de conexiones
async function initializePool() {
  try {
    console.log('🔧 Configurando Oracle Cloud Database...');
    console.log('📁 Wallet location:', walletLocation);
    console.log('🔗 Connect string:', dbConfig.connectString);
    
    await oracledb.createPool(dbConfig);
    
    console.log('✅ Pool de conexiones Oracle Cloud creado exitosamente');
    
    // Probar conexión
    const connection = await oracledb.getConnection();
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    console.log('✅ Conexión exitosa. Fecha del servidor:', result.rows[0][0]);
    await connection.close();
    
  } catch (err) {
    console.error('❌ Error al crear pool de conexiones:', err);
    console.error('Detalles:', {
      message: err.message,
      code: err.errorNum,
      offset: err.offset
    });
    process.exit(1);
  }
}

// Cerrar el pool
async function closePool() {
  try {
    await oracledb.getPool().close(10);
    console.log('✅ Pool de conexiones cerrado');
  } catch (err) {
    console.error('❌ Error al cerrar pool:', err);
  }
}

// Ejecutar consultas
async function execute(sql, binds = [], opts = {}) {
  let connection;
  opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
  opts.autoCommit = true;

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql, binds, opts);
    return result;
  } catch (err) {
    console.error('❌ Error en consulta:', err);
    console.error('SQL:', sql);
    console.error('Binds:', binds);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ Error al cerrar conexión:', err);
      }
    }
  }
}

module.exports = {
  initializePool,
  closePool,
  execute
};