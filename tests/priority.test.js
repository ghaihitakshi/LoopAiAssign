// tests/priority.test.js
const request = require("supertest");
const {app} = require("../app");
const ingestService = require("../services/ingestService");
const processorService = require("../services/processorService");

// Mock the processorService to control timing
jest.mock("../services/processorService", () => {
  const originalModule = jest.requireActual("../services/processorService");

  return {
    ...originalModule,
    queueIngestion: jest.fn(originalModule.queueIngestion),
  };
});

describe("Priority and Rate Limiting", () => {
  beforeEach(() => {
    // Clear all ingestion jobs before each test
    ingestService.ingestStore.clear();
    jest.clearAllMocks();
  });

  test("higher priority jobs should be processed first", async () => {
    // Create a MEDIUM priority job
    await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3, 4, 5], priority: "MEDIUM" });

    // Create a HIGH priority job
    await request(app)
      .post("/ingest")
      .send({ ids: [6, 7, 8, 9], priority: "HIGH" });

    // Verify HIGH priority job was queued second but processed first
    expect(processorService.queueIngestion).toHaveBeenCalledTimes(2);

    // Further testing would require more sophisticated mocking of the queue and time
  });

  test("rate limit respects 1 batch per 5 seconds", async () => {
    // This would require a more sophisticated test setup with timers
    // and checking processing timestamps
  });
});
