import express, { json } from "express";
import "dotenv/config.js";
import mongoose from "mongoose";
import router from "./routes/stupidWordsRouter.js";

const app = express();
const DBLINK = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

try {
  mongoose.connect(DBLINK);
  console.log("DB was connected");
} catch (error) {
  console.error(error);
  process.exit(1);
}

app.use(json());
app.use("/api/stupidwords", router);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
