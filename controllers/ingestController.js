const ingestService = require("../services/ingestService");

const createIngestJob = (req, res, next) => {
  try {
    const { ids, priority } = req.body;
    const ingestionId = ingestService.createIngestJob(ids, priority);

    res.status(201).json({ ingestion_id: ingestionId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIngestJob,
};
