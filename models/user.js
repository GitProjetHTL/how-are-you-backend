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
})

const userSchema = mongoose.Schema({
  username: String,
  email: String, 
  dateOfBirth: Date, 
  password: String,
  token: String,
  emotion : { type: mongoose.Schema.Types.ObjectId, ref: 'emotions' },
  survey: surveySchema, 
  comments: commentsSchema, 
});

const User = mongoose.model('users', userSchema);

module.exports = User;

