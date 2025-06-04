import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Listening at port: ${process.env.PORT}.`);
  connectDB();
});
