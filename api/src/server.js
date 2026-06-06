const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");

const startServer = async () => {
  const port = env.PORT;

  await connectDB();

  const server = app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the existing process or set a different PORT in .env.`);
      process.exit(1);
    }

    throw error;
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start API:", error);
    process.exit(1);
  });
}

module.exports = startServer;
