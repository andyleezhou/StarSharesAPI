const express = require("express");
require("dotenv").config();
const logger = require('./config/logger')

const DB = require("./config/db.js");
const UserRouter = require("./routes/userRouter");
const ArtistRouter = require("./routes/artistRouter");
const StockRouter = require("./routes/stockRouter")
const WatchListRouter = require("./routes/watchListRouter");
const NotificationRouter = require("./routes/notificationRouter");
const PortfolioRouter = require("./routes/portfolioRouter");
const SpotifyRouter = require("./routes/spotifyRouter");
const TransactionRouter = require("./routes/transactionRouter");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", UserRouter);
app.use("/api/artist", ArtistRouter);
app.use("/api", StockRouter);
app.use("/api", WatchListRouter);
app.use("/api", NotificationRouter);
app.use("/api", PortfolioRouter);
app.use("/api", SpotifyRouter);
app.use("/api", TransactionRouter);

DB.connectDB();

app.use((req, res, next) => {
  // Log an info message for each incoming request
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.get("/", (request, response) => {
  response.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
