const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employeeDB",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  connection.end();
});
