const { app } = require("./app");

const getTestPort = () => Math.floor(Math.random() * (9000 - 8000) + 8000);

const createTestServer = () => {
  const port = getTestPort();
  let server;

  return {
    start: () => {
      return new Promise((resolve) => {
        server = app.listen(port, () => {
          resolve(`http://localhost:${port}`);
        });
      });
    },
    stop: () => {
      return new Promise((resolve) => {
        if (server) {
          server.close(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
  };
};

module.exports = { createTestServer };
