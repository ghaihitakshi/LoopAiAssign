const ingestService = require("../services/ingestService");

const getIngestJobStatus = (req, res, next) => {
  try {
    const { ingestion_id } = req.params;
    const ingestion = ingestService.getIngestJob(ingestion_id);

    res.status(200).json(ingestion.toJSON());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIngestJobStatus,
};
