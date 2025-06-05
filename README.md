Data Ingestion API System
Overview
The Data Ingestion API System is a RESTful API designed to handle data ingestion requests and track their processing status. It processes data in batches asynchronously, respects rate limits, and prioritizes requests based on their priority (HIGH, MEDIUM, LOW). The system simulates fetching data from an external API and provides endpoints to submit ingestion requests and retrieve their status.
Features
Ingestion API (POST /ingest):
Accepts a list of IDs and a priority level.
Processes IDs in batches of 3.
Respects a rate limit of 1 batch per 5 seconds.
Prioritizes requests based on priority and creation time.
Returns a unique ingestion_id for each request.
Status API (GET /status/<ingestion_id>):
Retrieves the current status of an ingestion request.
Displays the status of each batch (yet_to_start, triggered, completed).
Provides the overall status of the ingestion request.
Asynchronous Processing:
Processes batches in the background.
Simulates external API calls with a delay.
Priority Handling:
Higher-priority requests (HIGH) are processed before lower-priority ones (MEDIUM, LOW).
Endpoints
1. Ingestion API
Endpoint: POST /ingest
Request Body:
json


  {
    "ids": [1, 2, 3, 4, 5],
    "priority": "HIGH"
  }
ids: List of integers (IDs to be processed).
priority: Enum (HIGH, MEDIUM, LOW).
Response:
json


  {
    "ingestion_id": "abc123"
  }
2. Status API
Endpoint: GET /status/<ingestion_id>
Response:
json


  {
    "ingestion_id": "abc123",
    "status": "triggered",
    "batches": [
      {"batch_id": "batch1", "ids": [1, 2, 3], "status": "completed"},
      {"batch_id": "batch2", "ids": [4, 5], "status": "triggered"}
    ]
  }
status: Overall status of the ingestion request.
yet_to_start: All batches are yet to start.
triggered: At least one batch is in progress.
completed: All batches are completed.
Technical Details
1. Batching
IDs are processed in batches of 3.
Each batch is processed asynchronously with a delay of 5 seconds between batches.
2. Priority Handling
Requests are processed based on:
Priority (HIGH > MEDIUM > LOW).
Creation Time (earlier requests are processed first if priorities are the same).
3. In-Memory Storage
Ingestion jobs and their statuses are stored in an in-memory Map object.
Data is lost when the server restarts.
4. Simulated External API
Each ID is "processed" by simulating an external API call with a delay.
Mock response:
json


  {
    "id": <id>,
    "data": "processed"
  }
How to Run the Project Locally
1. Prerequisites
Install Node.js (version 14 or higher).
Install npm.
2. Clone the Repository
bash


git clone
cd 
3. Install Dependencies
bash


npm install
4. Start the Server
bash


npm start
The server will run on http://localhost:3000.
How to Test the Project
1. Automated Tests
Run the test suite:
bash


  npm test
The tests verify:
Correct batching and rate limiting.
Priority handling.
Status API responses.
2. Manual Testing
Use Postman or cURL to test the endpoints.
Ingestion API Example
bash


curl -X POST http://localhost:3000/ingest \
-H "Content-Type: application/json" \
-d '{"ids": [1, 2, 3, 4, 5], "priority": "HIGH"}'
Status API Example
bash


curl http://localhost:3000/status/<ingestion_id>
Deployment
1. Hosting
The application is deployed on Render (or any other platform of your choice).
2. Hosted URL
Base URL: https://your-app-name.onrender.com
3. Example Requests
Ingestion API
bash


curl -X POST  https://loopai-ingestion.onrender.com/ \
-H "Content-Type: application/json" \
-d '{"ids": [1, 2, 3, 4, 5], "priority": "HIGH"}'
Status API
bash


curl  https://loopai-ingestion.onrender.com/status/<ingestion_id>
Project Structure
javascript


.
├── app.js                     # Main application file
├── controllers/
│   ├── ingestController.js    # Handles ingestion API logic
│   └── statusController.js    # Handles status API logic
├── services/
│   ├── ingestService.js       # Manages ingestion jobs and statuses
│   └── processorService.js    # Handles batch processing and rate limiting
├── models/
│   ├── ingestion.js           # Defines the Ingestion class
│   └── batch.js               # Defines the Batch class
├── middleware/
│   └── validators.js          # Validates API payloads
├── tests/
│   ├── ingest.test.js         # Tests for ingestion API
│   └── status.test.js         # Tests for status API
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation
Design Choices
In-Memory Storage:
Simple and fast for this simulated environment.
Not suitable for production (can be replaced with a database like MongoDB or PostgreSQL).
Priority Queue:
Ensures higher-priority requests are processed first.
Uses the @datastructures-js/priority-queue library.
Asynchronous Processing:
Simulates external API calls with delays.
Processes batches in the background.
Rate Limiting:
Enforces a delay of 5 seconds between batches.
Future Enhancements
Add persistent storage (e.g., MongoDB, PostgreSQL).
Implement retry logic for failed batches.
Add authentication and authorization (if required).
Improve error handling and logging.
Deliverables
Hosted URL: https://loopai-ingestion.onrender.com/
