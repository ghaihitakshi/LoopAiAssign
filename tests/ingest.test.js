const request = require("supertest");
const { createTestServer } = require("../testServer"); // Import the test server helper
const ingestService = require("../services/ingestService");
const processorService = require("../services/processorService"); // Import the processor service
const { app } = require("../app");
describe("POST /ingest", () => {
  let server;
  let baseUrl;

  // Before all tests, start a test server
  beforeAll(async () => {
    server = createTestServer();
    baseUrl = await server.start();
  });

  // After all tests, stop the test server
  // Stop the test server and processor service after all tests
  afterAll(async () => {
    await server.stop();
    processorService.stopProcessing(); // Stop the processor service
    // jest.useRealTimers(); // Restore real timers after tests
  });
    
  beforeEach(() => {
    // Clear all ingestion jobs before each test
    ingestService.ingestStore.clear();
  });

  test("should create a new ingestion job with valid payload", async () => {
    const response = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3, 4, 5], priority: "HIGH" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("ingestion_id");
    expect(typeof response.body.ingestion_id).toBe("string");
  });

  test("should reject payload with invalid IDs", async () => {
    const response = await request(app)
      .post("/ingest")
      .send({ ids: ["not-an-id", 2, 3], priority: "HIGH" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("should reject payload with invalid priority", async () => {
    const response = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3], priority: "INVALID" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("should use default MEDIUM priority when not provided", async () => {
    const response = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3] });

    expect(response.statusCode).toBe(201);

    // Get the ingestion_id from response
    const { ingestion_id } = response.body;

    // Check if the ingestion has MEDIUM priority in the store
    const ingestion = ingestService.ingestStore.get(ingestion_id);
    expect(ingestion.priority).toBe("MEDIUM");
  });
});
