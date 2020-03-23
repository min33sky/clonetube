const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

router.post('/getLikes', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
    };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
      likes,
    });
  });
});

router.post('/getDislikes', (req, res) => {
  let variable = {};

  if (req.body.videoId) {
    variable = {
      videoId: req.body.videoId,
    };
  } else {
    variable = {
      commentId: req.body.commentId,
    };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({
      success: true,
      dislikes,
    });
  });
});

// 좋아요 버튼 클릭하기
router.post('/upLike', auth, (req, res) => {
  const like = new Like(req.body);

  like.save((err, result) => {
    if (err) return res.status(400).send(err);

    // 싫어요가 눌러져 있었을 경우 싫어요를 취소한다.
    Dislike.findOneAndDelete(req.body).exec((err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', auth, (req, res) => {
  Like.findOneAndDelete(req.body).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

// 싫어요
router.post('/upDislike', auth, (req, res) => {
  const dislike = new Dislike(req.body);

  dislike.save((err, result) => {
    if (err) return res.status(400).send(err);

    Like.findOneAndDelete(req.body).exec((err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true });
    });
  });
});

router.post('/unDislike', auth, (req, res) => {
  Dislike.findOneAndDelete(req.body).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
