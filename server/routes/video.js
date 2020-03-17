const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  let typeArray = file.mimetype.split('/');
  let fileType = typeArray[1];
  if (fileType === 'mp4') {
    cb(null, true);
  } else {
    req.fileValidationError = 'mp4 파일만 업로드 가능합니다.';
    // cb(null, false, new Error('mp4 파일만 업로드 가능합니다.'));
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).single('file');

// =================================================
//                      VIDEO
// =================================================

router.post('/uploadfiles', auth, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    // 확장자가 다를 때는 업로드를 막고 에러메세지를 보낸다.
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    return res.status(200).json({
      success: true,
      // url: res.req.file.path,
      // filename: res.req.file.filename,
      url: req.file.path,
      filename: req.file.filename,
    });
  });
});

module.exports = router;
