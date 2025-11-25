// D:\semester 5\pws\praktikum7\config\db.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'marklee123##',
  database: process.env.DB_NAME || 'tugasdb',
  port: process.env.DB_PORT || 3309,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
