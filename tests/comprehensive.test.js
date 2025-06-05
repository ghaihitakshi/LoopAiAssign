const request = require("supertest");
const {app} = require("../app");
const ingestService = require("../services/ingestService");

describe("Comprehensive Test", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    ingestService.ingestStore.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should process batches in correct order based on priority and time", async () => {
    const res1 = await request(app)
      .post("/ingest")
      .send({ ids: [1, 2, 3, 4, 5], priority: "MEDIUM" });

    jest.advanceTimersByTime(4000);

    const res2 = await request(app)
      .post("/ingest")
      .send({ ids: [6, 7, 8, 9], priority: "HIGH" });


  });
});
