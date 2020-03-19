const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    writer: {
      // * _id 값으로 해당하는 'User' 정보를 모두 가져온다.
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true },
);

const Video = mongoose.model('video', videoSchema);

module.exports = { Video };
