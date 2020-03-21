const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema(
  {
    // 구독 받는 사람
    userTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // 구독 하는 사람
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Subscriber = mongoose.model('subscriber', SubscriberSchema);

module.exports = { Subscriber };
