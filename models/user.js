const mongoose = require("mongoose");

const surveySchema = mongoose.Schema({
  subjects: Array,
  expectations: Array,
  conditions: Boolean,
});

const historiqueSchema = mongoose.Schema({
  emotion: String,
  date: Date,
});

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  dateOfBirth: String,
  password: String,
  token: String,
  emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emotion" }],
  historique: [historiqueSchema],
  survey: surveySchema,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
