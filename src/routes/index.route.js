const path = require('path');
const multer = require('multer');
const storage = require('../lib/multerConfig');
const { saveVideoToS3 } = require('../controllers/video.controller');

const router = require('express').Router();

const upload = multer({ storage: storage });

router.get('', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.ejs'));
});

router.post('/video/save', upload.single('video'), saveVideoToS3);

module.exports = router;
