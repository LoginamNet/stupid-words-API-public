import stupidWords from "../models/stupidWordsShema.js";

const getAllWords = async (req, res) => {
  try {
    const query = req.query;
    let filteredQuery = {};
    let sortOrder = ["word", "asc"];

    if (query.word) filteredQuery.word = { $regex: query.word, $options: "i" };

    if (query.type) {
      const correctTypes = ["verb", "noun", "exp"];
      const types = query.type.split("-");

      types.filter((type) =>
        correctTypes.forEach((correctType) => type === correctType)
      );

      filteredQuery.type = { $in: types };
    }

    if (query.mature && (query.mature === "true" || query.mature === "false")) {
      filteredQuery.mature = query.mature;
    }

    if (query.sort) {
      const correctSortOrders = [
        "word-asc",
        "word-desc",
        "updatedAt-asc",
        "updatedAt-desc",
        "likes-asc",
        "likes-desc",
      ];
      const correctSortOrder = correctSortOrders
        .find((el) => el === query.sort)
        .split("-");

      sortOrder = correctSortOrder ? correctSortOrder : sortOrder;
    }

    const allWords = await stupidWords.find(filteredQuery).sort([sortOrder]);

    res.status(201).send({
      status: "OK",
      amount: allWords.length,
      data: allWords,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const getOneWord = async (req, res) => {
  try {
    const { id } = req.params;
    const word = await stupidWords.findById(id);

    res.status(201).send({
      status: "OK",
      data: word,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const getRandomWord = async (req, res) => {
  try {
    const randomWord = await stupidWords.aggregate([{ $sample: { size: 1 } }]);

    res.status(201).send({
      status: "OK",
      data: randomWord,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const createNewWord = async (req, res) => {
  try {
    const newWord = new stupidWords({
      word: req.body.word,
      type: req.body.type,
      text: req.body.text,
      mature: req.body.mature,
      createdAt: new Date().toLocaleString("ru-RU", { timezone: "UTC" }),
      updatedAt: new Date().toLocaleString("ru-RU", { timezone: "UTC" }),
      likes: 0,
    });

    const insertedWord = await newWord.save();

    res.status(201).send({
      status: "OK",
      data: insertedWord,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const updateOneWord = async (req, res) => {
  try {
    const { id } = req.params;

    await stupidWords.findByIdAndUpdate(id, {
      ...req.body,
      updatedAt: new Date().toLocaleString("ru-RU", { timezone: "UTC" }),
    });

    const updatedWord = await stupidWords.findById(id);

    res.status(201).send({
      status: "OK",
      data: updatedWord,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const addLikeToWord = async (req, res) => {
  try {
    const { id } = req.params;
    const word = await stupidWords.findById(id);

    await stupidWords.findByIdAndUpdate(id, {
      likes: word.likes + 1,
      updatedAt: new Date().toLocaleString("ru-RU", { timezone: "UTC" }),
    });

    const updatedWord = await stupidWords.findById(id);

    res.status(201).send({
      status: "OK",
      data: `Likes amount for ${updatedWord.word} increased to: ${updatedWord.likes}`,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const addDislikeToWord = async (req, res) => {
  try {
    const { id } = req.params;
    const word = await stupidWords.findById(id);

    await stupidWords.findByIdAndUpdate(id, {
      likes: word.likes - 1,
      updatedAt: new Date().toLocaleString("ru-RU", { timezone: "UTC" }),
    });

    const updatedWord = await stupidWords.findById(id);

    res.status(201).send({
      status: "OK",
      data: `Likes amount for ${updatedWord.word} decreased to: ${updatedWord.likes}`,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

const deleteOneWord = async (req, res) => {
  try {
    const { id } = req.params;
    const word = await stupidWords.findById(id);

    await stupidWords.findByIdAndDelete(id);

    res.status(201).send({
      status: "OK",
      data: `Word ${word.word} with ID ${id} was removed from DB`,
    });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      data: { error: error?.message || error },
    });
  }
};

export default {
  getAllWords,
  getOneWord,
  getRandomWord,
  createNewWord,
  updateOneWord,
  addLikeToWord,
  addDislikeToWord,
  deleteOneWord,
};
