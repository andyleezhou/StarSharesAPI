const express = require("express"); 
require("dotenv").config()

const DB = require("./config/db.js");
const UserRouter = require("./routes/userRouter");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", UserRouter);

DB.connectDB();

app.get("/", (request, response) => {
  response.send({ message: "Hello from an Express API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});