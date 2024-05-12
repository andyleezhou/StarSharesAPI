const mongoose = require("mongoose")
require("dotenv").config()


const connectDB = () => {
  const url = process.env.MONGO_CONNECTION || "mongodb+srv://andyzhou:7fDdHqYJyJPJK8H4@cecs323.qs5vj94.mongodb.net/?retryWrites=true&w=majority";

  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}


exports.connectDB = connectDB;