const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./guestbook.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      regdate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
