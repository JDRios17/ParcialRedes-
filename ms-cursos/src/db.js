// =====================================================================
// Conexión a MySQL mediante pool de promesas - ms-cursos
// =====================================================================
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'cursos_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dateStrings: true,
  decimalNumbers: true,
});

module.exports = pool;