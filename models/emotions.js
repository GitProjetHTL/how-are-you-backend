const mongoose = require("mongoose");

const emotionSchema = mongoose.Schema({
  name: String,
  emotionRemede: [String],
  description: String,
  imageUrl: String,
  score: Number,
});

const Emotion = mongoose.model("emotions", emotionSchema);

module.exports = Emotion;
