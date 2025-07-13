const express = require("express");
const winston = require("winston");

const app = express();
const port = 3002;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return {
        timestamp,
        level,
        message,
        ...meta,
      };
    })
  ),
  transports: [new winston.transports.Console()],
});

app.get("/hit-test", (req, res) => {
  const trace_id = req.headers["x-trace-id"] || "not-traced";
  const span_id = req.headers["x-span-id"] || "not-traced";
  const caller = req.headers["caller"] || "unknown";

  const isFail = Math.random() < 0.5; // 50% chance error (for simulation purposes)
  if (isFail) {
    const errorMessage = "akodwkokdw gagal coy";
    logger.error({
      message: errorMessage,
      service: "service2",
      operation: "handle_hit_test",
      trace_id,
      span_id,
      caller: caller,
      status_code: 500,
      error_message: errorMessage,
    });
    return res.status(500).send("Service 2 error");
  }

  logger.info({
    message: "Handled API hit successfully",
    service: "service2",
    operation: "handle_hit_test",
    trace_id,
    span_id,
    caller: caller,
    status_code: 200,
  });

  res.send("BERHASIL COYYYYYYYYY");
});

app.listen(port, () => {
  logger.info({
    service: "service2",
    action: "startup",
    message: `Service 2 running on port ${port}`,
  });
});
