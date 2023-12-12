import { Schema, model } from "mongoose";

const stupidWordsSchema = new Schema({
  word: String,
  type: String,
  text: String,
  mature: String,
  createdAt: String,
  updatedAt: String,
  likes: Number,
});

const stupidWords = model("SWDB", stupidWordsSchema, "stupidWords");

export default stupidWords;
