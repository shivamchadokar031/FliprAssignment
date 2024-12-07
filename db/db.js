const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "shivam",
  password: "admin123",
  database: "ecommerce",
  port: 8889,
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;
