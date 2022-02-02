const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },

  filename: (req, file, cb) => {
    const fileType = file.mimetype.split('/');
    cb(null, `${file.fieldname}-${Date.now()}.${fileType[1]}`);
  },
});

module.exports = storage;
