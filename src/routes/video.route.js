const router = require('express').Router();
const multer = require('multer');
const storage = require('../lib/multerConfig');
const {
  uploadVideoToS3,
  getVideoFromS3,
} = require('../controllers/video.controller');

const upload = multer({ storage: storage });

router.get('/get/:key', getVideoFromS3);

router.post('/save', upload.single('video'), uploadVideoToS3);

module.exports = router;
