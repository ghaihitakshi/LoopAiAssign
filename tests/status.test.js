const request = require("supertest");
const { createTestServer } = require("../testServer"); // Import the test server helper
const ingestService = require("../services/ingestService");
const processorService = require("../services/processorService"); // Import the processor service
const { app } = require("../app");

describe("GET /status/:ingestion_id", () => {
    let server;
    let baseUrl;

    // Before all tests, start a test server
    beforeAll(async () => {
      server = createTestServer();
      baseUrl = await server.start();
    });
  beforeEach(() => {
    // Clear all ingestion jobs before each test
    ingestService.ingestStore.clear();
  });
    
  afterAll(async () => {
    await server.stop();
    processorService.stopProcessing(); // Stop the processor service
  });
    
  test("should return 404 for non-existent ingestion ID", async () => {
    const response = await request(app).get("/status/non-existent-id");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  test("should return correct status for existing ingestion ID", async () => {
    // First create an ingestion job
    const ingestResponse = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3], priority: "LOW" });

    expect(ingestResponse.statusCode).toBe(201);
    const { ingestion_id } = ingestResponse.body;

    // Then check its status
    const statusResponse = await request(app).get(`/status/${ingestion_id}`);

    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body).toHaveProperty("ingestion_id", ingestion_id);
    expect(statusResponse.body).toHaveProperty("status");
    expect(statusResponse.body).toHaveProperty("batches");
    expect(Array.isArray(statusResponse.body.batches)).toBe(true);
  });

  test("should show batch processing status correctly", async () => {
    // Create an ingestion job with multiple batches
    const ingestResponse = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3, 4, 5, 6, 7], priority: "MEDIUM" });

    const { ingestion_id } = ingestResponse.body;

    // Check status
    const statusResponse = await request(app).get(`/status/${ingestion_id}`);

    // Verify we have correct number of batches (3 IDs per batch)
    expect(statusResponse.body.batches.length).toBe(3);
    expect(statusResponse.body.batches[0].ids.length).toBe(3);
    expect(statusResponse.body.batches[1].ids.length).toBe(3);
    expect(statusResponse.body.batches[2].ids.length).toBe(1);
  });
});
