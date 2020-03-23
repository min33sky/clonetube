const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
  },
});

const Like = mongoose.model('like', likeSchema);

module.exports = {
  Like,
};
