const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const app = express();
const PORT = process.env.PORT || 3002;
const morgan = require("morgan");
const cors = require("cors");
const https = require('https'); // Change from 'http' to 'https'

const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const formsRouteV1 = require("./routes/formRouteV1");
const formsRouteV2 = require("./routes/formRouteV2");
const formsRouteV3 = require("./routes/formRouteV3");
const formsRouteV4 = require("./routes/formRouteV4");
const formsRouteV5 = require("./routes/formRouteV5");

// Middlewares
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// DB connection
dbConnection();

// Mount Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/forms", formsRouteV1);
app.use("/api/v2/forms", formsRouteV2);
app.use("/api/v3/forms", formsRouteV3);
app.use("/api/v4/forms", formsRouteV4);
app.use("/api/v5/forms", formsRouteV5);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Ping the server immediately after starting the server
pingServer();

// Ping the server every 14 minutes (14 * 60 * 1000 milliseconds)
const pingInterval = 15 * 60 * 1000;
setInterval(pingServer, pingInterval);

// Function to ping the server by hitting the specified API route
function pingServer() {
  const pingEndpoint = 'https://samaco-summer-1eox.onrender.com/api/v1/auth/login';

  // Send a GET request to the ping endpoint
  https.get(pingEndpoint, (res) => {
    console.log(`Ping sent to server: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Error while sending ping:', err);
  });
}

// UnhandledRejections event handler (rejection outside express)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server shutting down...");
    process.exit(1);
  });
});
