const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'marklee123##',
  database: 'tugasdb',
  port: 3309, 
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();