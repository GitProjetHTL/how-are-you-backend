const mongoose = require('mongoose');

const emotionSchema = mongoose.Schema({
  // nom emotion
  name: String,
  emotionRemede: String,
  description: String,
  imageUrl: String,
  createdAt: Date,
});

const Emotion = mongoose.model('emotions', emotionSchema);

module.exports = Emotion;


