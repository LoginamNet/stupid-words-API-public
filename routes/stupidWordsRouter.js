import { Router } from "express";
import stupidWordsController from "../controllers/stupidWordsController.js";

const router = Router();

router.get("/", stupidWordsController.getAllWords);

router.get("/:id", stupidWordsController.getOneWord);

router.get("/word/random", stupidWordsController.getRandomWord);

router.post("/", stupidWordsController.createNewWord);

router.patch("/:id", stupidWordsController.updateOneWord);

router.patch("/:id/like", stupidWordsController.addLikeToWord);

router.patch("/:id/dislike", stupidWordsController.addDislikeToWord);

router.delete("/:id", stupidWordsController.deleteOneWord);

export default router;
