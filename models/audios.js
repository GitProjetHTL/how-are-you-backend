const mongoose = require('mongoose');

const audiosSchema = mongoose.Schema({ 
name: String, 
target: [String],
content: String,
source: String, 
like: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const Audio = mongoose.model('audios', audiosSchema);

module.exports = Audio;
