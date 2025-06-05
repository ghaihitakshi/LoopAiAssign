const { v4: uuidv4 } = require("uuid");
const Batch = require("./batch");

class Ingestion {
  constructor(ids, priority = "MEDIUM") {
    this.ingestion_id = uuidv4();
    this.created_at = new Date();
    this.priority = priority;
    this.batches = this.createBatches(ids);
    this.status = "yet_to_start";
  }

  createBatches(ids) {
    const batches = [];
    const batchSize = 3; 

    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      batches.push(new Batch(batchIds));
    }

    return batches;
  }

  updateStatus() {
    const allCompleted = this.batches.every(
      (batch) => batch.status === "completed"
    );
    if (allCompleted) {
      this.status = "completed";
      return;
    }

    const anyTriggered = this.batches.some(
      (batch) => batch.status === "triggered"
    );
    if (anyTriggered) {
      this.status = "triggered";
      return;
    }

    this.status = "yet_to_start";
  }

  toJSON() {
    return {
      ingestion_id: this.ingestion_id,
      status: this.status,
      batches: this.batches.map((batch) => batch.toJSON()),
    };
  }
}

module.exports = Ingestion;
