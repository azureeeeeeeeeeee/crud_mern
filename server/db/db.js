import mysql from "mysql";

// Creating db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todoexpress",
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database.");
  }
});

export default db;
