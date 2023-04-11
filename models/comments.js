const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
author: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, 
content: String,
date: Date,
})

const Comment = mongoose.model('comments', commentsSchema);

module.exports = Comment;