const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
subjects: Array,
expectations: Array,
conditions : Boolean,
})

const commentsSchema = mongoose.Schema({
title : String,
content: String,
date : Date,
emotionOfTheDay : Array, 
})

const userSchema = mongoose.Schema({
  username: String,
  email: String, 
  dateOfBirth: Date, 
  password: String,
  token: String,
  survey: surveySchema, 
  emotions : { type: mongoose.Schema.Types.ObjectId, ref: 'emotions' },
  comments: commentsSchema, 
});

const User = mongoose.model('users', userSchema);

module.exports = User;

