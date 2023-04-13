const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
subjects: String,
expectations: String,
conditions : Boolean,
})

const historiqueSchema = mongoose.Schema({
  emotion: String, 
  date: Date,
})

const userSchema = mongoose.Schema({
  username: String,
  email: String, 
  dateOfBirth: Date, 
  password: String,
  token: String,
  emotion : {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Emotion' }],
    default: [],
  },
  historique: [historiqueSchema], 
  survey: surveySchema, 
});

const User = mongoose.model('users', userSchema);

module.exports = User;

