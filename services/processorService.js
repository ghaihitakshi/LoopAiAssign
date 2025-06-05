const { MaxPriorityQueue } = require("@datastructures-js/priority-queue");

const PRIORITY_VALUES = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const ingestQueue = new MaxPriorityQueue({
  compare: (a, b) => {
=    const priorityDiff =
      PRIORITY_VALUES[b.priority] - PRIORITY_VALUES[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return a.created_at - b.created_at;
  },
});

// Flag to track if processor is currently running
let isProcessing = false;
let processingTimeout = null; 
const queueIngestion = (ingestion) => {
  ingestQueue.enqueue(ingestion);

  if (!isProcessing) {
    startProcessing();
  }
};

// Start processing the queue
const startProcessing = async () => {
  isProcessing = true;

  while (!ingestQueue.isEmpty()) {
    const ingestion = ingestQueue.dequeue();

    // Process each batch with rate limiting
    for (const batch of ingestion.batches) {
      if (batch.status === "yet_to_start") {
        await processBatch(batch);
        ingestion.updateStatus();
      }
    }
  }

  isProcessing = false;
};

// Process a single batch
const processBatch = async (batch) => {
  batch.setStatus("triggered");

  const promises = batch.ids.map((id) => processId(id, batch));
  await Promise.all(promises);

  await new Promise((resolve) => {
    processingTimeout = setTimeout(resolve, 5000);
  });

  // Update status to completed
  batch.setStatus("completed");
};

const processId = async (id, batch) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = { id: id, data: "processed" };
  batch.addResult(result);

  return result;
};
const stopProcessing = () => {
  isProcessing = false;

  if (processingTimeout) {
    clearTimeout(processingTimeout);
    processingTimeout = null;
  }
};


module.exports = {
  queueIngestion,
  stopProcessing,
};
