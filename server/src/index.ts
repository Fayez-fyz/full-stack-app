import express, { Application, urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";

import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const transactionRouter = require("./routes/transaction");

app.use(cors());

app.use(express.json());

app.use(urlencoded({ extended: true }));

// console.log(process.env.DB);

//Connect to MongoDB
mongoose
  .connect(process.env.DB as string)
  .then(() => console.log("DB IS CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

app.use("/api", transactionRouter);

const port: number = parseInt(process.env.PORT || "5000");

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
