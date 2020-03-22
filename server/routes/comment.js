const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Comment } = require('../models/Comment');

router.post('/saveComment', auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, doc) => {
    if (err) return res.status(400).send(err);
    // 작성자의 정보까지 populate해서 가져오자
    Comment.find({ _id: doc._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({
          success: true,
          result,
        });
      });
  });
});

router.post('/getComments', (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({
        success: true,
        comments,
      });
    });
});

module.exports = router;
