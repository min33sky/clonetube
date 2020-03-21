const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Subscriber } = require('../models/Subscriber');

// 구독자 수 리턴
router.post('/subscribeNumber', (req, res) => {
  // 일치하는 userTo (구독 당하는 사람)의 다큐먼트 개수를 가져온다.
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
      subscribeNumber: subscribe.length,
    });
  });
});

// 동영상 제공자에게 구독했는지 유무
router.post('/subcribed', (req, res) => {
  console.log('구독 유무 #####################################');
  Subscriber.find({
    userTo: req.body.userTo, // 동영상 제공자
    userFrom: req.body.userFrom, // 로그인 한 사람 (나)
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    let result = false;
    if (subscribe.length !== 0) {
      result = true;
    }
    return res.status(200).json({ success: true, subscribed: result });
  });
});

// 구독 하기
router.post('/subscribe', auth, (req, res) => {
  const subscribe = new Subscriber(req.body);
  subscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// 구독 취소하기
router.post('/unsubscibe', auth, (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

module.exports = router;
