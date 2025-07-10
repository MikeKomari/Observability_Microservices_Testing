const express = require("express");
const axios = require("axios");

const app = express();
const port = 3001;

app.get("/", async (req, res) => {
  try {
    await axios.get("http://service-b:3002/hit-test");
    res.send("Service 1 called Service 2");
  } catch (e) {
    console.error("Error calling Service 2:", e.message);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Service 1 running on port ${port}`);
});
