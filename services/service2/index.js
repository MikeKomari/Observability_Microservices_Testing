const express = require("express");

const app = express();
const port = 3002;

app.get("/hit-test", (req, res) => {
  res.send("Service 2 is being hit on");
});

app.get("/", (req, res) => {
  res.send("HIIIIII");
});

app.listen(port, () => {
  console.log(`Service 2 running on port ${port}`);
});
