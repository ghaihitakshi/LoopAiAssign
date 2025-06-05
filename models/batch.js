const { v4: uuidv4 } = require("uuid");

class Batch {
  constructor(ids) {
    this.batch_id = uuidv4();
    this.ids = ids;
    this.status = "yet_to_start";
    this.results = [];
  }

  setStatus(status) {
    this.status = status;
  }

  addResult(result) {
    this.results.push(result);
  }

  toJSON() {
    return {
      batch_id: this.batch_id,
      ids: this.ids,
      status: this.status,
    };
  }
}

module.exports = Batch;
