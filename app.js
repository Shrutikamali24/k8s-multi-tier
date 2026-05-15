const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

let db;

function connectDB() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect(err => {
    if (err) {
      console.log("❌ DB connection failed, retrying in 5 sec...");
      setTimeout(connectDB, 5000);
    } else {
      console.log("✅ Connected to MySQL!");
    }
  });

  db.on('error', err => {
    console.log("⚠️ DB error, reconnecting...", err);
    connectDB();
  });
}

connectDB();

app.get('/', (req, res) => {
  db.query('SELECT "Welcome to Kubernetes Deployment!" AS message', (err, result) => {
    if (err) {
      res.send("Database error: " + err);
    } else {
      res.send(result[0].message);
    }
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
