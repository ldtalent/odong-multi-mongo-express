const mongoose = require('mongoose');

const { Schema } = mongoose;

const postModel = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'authors',
  },
  date: {
    type: Date,
    required: true,
  },
});


module.exports = mongoose.model('posts', postModel);
