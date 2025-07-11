const express = require("express");
const winston = require("winston");

const app = express();
const port = 3002;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

app.get("/hit-test", (req, res) => {
  const trace_id = req.headers["x-trace-id"] || "not-traced";

  logger.info({
    trace_id,
    service: "service2",
    action: "incoming_request",
    message: "Received request from service1",
  });

  // Simulasi delay atau error di sini jika ingin
  res.send("Hello from Service 2");
});

app.listen(port, () => {
  logger.info({
    service: "service2",
    action: "startup",
    message: `Service 2 running on port ${port}`,
  });
});
