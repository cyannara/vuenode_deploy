const express = require("express");
const app = express();
const port = 3000;

const guestbookRouter = require("./routes/guestbook");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/guestbook", guestbookRouter);

app.get("/", (req, res) => {
  console.log(req.url);
  res.send("Hello World! 6");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
