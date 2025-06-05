const Ingestion = require("../models/ingestion");
const processorService = require("./processorService");

// In-memory storage for ingestion jobs
const ingestStore = new Map();

const createIngestJob = (ids, priority) => {
  const ingestion = new Ingestion(ids, priority);
  ingestStore.set(ingestion.ingestion_id, ingestion);

  // Queue the job for processing
  processorService.queueIngestion(ingestion);

  return ingestion.ingestion_id;
};

const getIngestJob = (ingestionId) => {
  const ingestion = ingestStore.get(ingestionId);
  if (!ingestion) {
    const error = new Error("Ingestion job not found");
    error.statusCode = 404;
    throw error;
  }
  return ingestion;
};

module.exports = {
  createIngestJob,
  getIngestJob,
  ingestStore, 
};
