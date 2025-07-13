const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const winston = require("winston");

const app = express();
const port = 3001;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Middleware untuk menyisipkan trace_id
app.use((req, res, next) => {
  req.trace_id = uuidv4();
  req.span_id = uuidv4();
  next();
});

app.get("/", async (req, res) => {
  const trace_id = req.trace_id;
  logger.info({
    trace_id,
    service: "service1",
    action: "incoming_request",
    message: "Received request, calling service2",
  });

  try {
    const response = await axios.get("http://service2:3002/hit-test", {
      headers: {
        "x-trace-id": trace_id,
        "x-span-id": uuidv4(),
        "x-caller-id": "service-a",
      },
    });

    logger.info({
      trace_id,
      service: "service1",
      action: "service2_response",
      status: response.status,
      data: response.data,
    });

    res.send("Service 1 called Service 2");
  } catch (e) {
    logger.error({
      trace_id,
      service: "service1",
      action: "error_calling_service2",
      error: e.message,
    });
    res.status(500).send("Error calling Service 2");
  }
});

app.listen(port, () => {
  logger.info({
    service: "service1",
    action: "startup",
    message: `Service 1 running on port ${port}`,
  });
});
