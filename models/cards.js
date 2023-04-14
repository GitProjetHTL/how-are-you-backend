const mongoose = require("mongoose");

const cardsSchema = mongoose.Schema({
  name: String,
  target: [String],
  content: String,
  source: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Card = mongoose.model("cards", cardsSchema);

module.exports = Card;
