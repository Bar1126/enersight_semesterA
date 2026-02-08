const mysql = require("mysql2");

// ! the following  creates and uses one database connection for all queries. This single connection is established the first time getDbConnection is called and is then reused for subsequent database operations across your application

// ! with a single connection multiple queries will be executed sequentially

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "enersightdb",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
