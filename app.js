import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectMongoDB } from "./db/mongodbConnection.js";
import exampleRoute from "./routes/exampleRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/v1/example", exampleRoute);
app.use("/api/v1/auth", authRoute);

const startServer = async () => {
  try {
    connectMongoDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
