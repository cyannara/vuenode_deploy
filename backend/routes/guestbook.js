const express = require("express");
const router = express.Router();
const db = require("../db/db");

/* 등록 */
router.post("/", (req, res) => {
  const { name, message } = req.body;

  db.run(
    "INSERT INTO guestbook(name,message) VALUES(?,?)",
    [name, message],
    () => res.json({ success: true })
  );
});

/* 전체조회 */
router.get("/", (req, res) => {
  db.all("SELECT * FROM guestbook ORDER BY id DESC", [], (err, rows) =>
    res.json(rows)
  );
});

/* 삭제 */
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM guestbook WHERE id=?", [req.params.id], () =>
    res.json({ success: true })
  );
});

module.exports = router;
