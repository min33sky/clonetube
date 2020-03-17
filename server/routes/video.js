const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const ffmpeg = require('fluent-ffmpeg');

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
      return res.json({ success: false, message: req.fileValidationError });
    }

    return res.status(200).json({
      success: true,
      filePath: req.file.path,
      fileName: req.file.filename,
    });
  });
});

router.post('/thumbnail', auth, (req, res) => {
  let thumbsFilePath = '';
  let fileDuration = 0;

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  // * 썸네일 생성
  ffmpeg(req.body.filePath) // 서버의 저장된 파일 주소
    .on('filenames', function(filenames) {
      // 비디오 썸네일 파일 이름 생성
      console.log('Will generate ' + filenames.join(', '));
      thumbsFilePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function() {
      // 썸네일 생성 후 할 일
      console.log('Screenshots taken');
      return res.json({
        success: true,
        thumbsFilePath,
        fileDuration,
      });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

module.exports = router;
