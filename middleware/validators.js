const validateIngestPayload = (req, res, next) => {
  const { ids, priority } = req.body;

  // Validate IDs
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "IDs must be provided as an array" });
  }

  if (ids.length === 0) {
    return res.status(400).json({ error: "At least one ID must be provided" });
  }

  const validIds = ids.every(
    (id) => Number.isInteger(id) && id > 0 && id <= 1e9 + 7
  );
  if (!validIds) {
    return res
      .status(400)
      .json({ error: "All IDs must be integers between 1 and 10^9+7" });
  }

  const validPriorities = ["HIGH", "MEDIUM", "LOW"];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Priority must be one of: ${validPriorities.join(", ")}`,
    });
  }

  if (!priority) {
    req.body.priority = "MEDIUM";
  }

  next();
};

module.exports = {
  validateIngestPayload,
};
