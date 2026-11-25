
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'sazon_app',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sazon_urbano',
    charset: 'utf8mb4',

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});

module.exports = pool;
