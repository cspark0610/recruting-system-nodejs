import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads');
  },

  filename: (_req, file, cb) => {
    const fileType = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${Date.now()}.${fileType}`);
  },
});

export default storage;
