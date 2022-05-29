import { diskStorage } from 'multer';

// sets destination folder where files are temporarily uploaded
export const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads');
  },

  // sets the file name
  filename: (_req, file, cb) => {
    const fileType = file.originalname.split('.').pop();
    cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${fileType}`);
  },
});
