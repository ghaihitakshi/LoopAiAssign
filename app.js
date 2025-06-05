const express = require("express");
const bodyParser = require("body-parser");

const ingestController = require("./controllers/ingestController");
const statusController = require("./controllers/statusController");

const validators = require("./middleware/validators");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post(
  "/ingest",
  validators.validateIngestPayload,
  ingestController.createIngestJob
);
app.get("/status/:ingestion_id", statusController.getIngestJobStatus);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
