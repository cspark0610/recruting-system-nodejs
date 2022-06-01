import { diskStorage } from 'multer';

// sets destination folder where files are temporarily uploaded
export const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads');
  },

  // sets the file name
  filename: (_req, file, cb) => {
    let fileType;

    if (file.originalname === 'blob') {
      fileType = file.mimetype.split('/')[1];
    } else {
      fileType = file.originalname.split('.').pop();
    }
    cb(
      null,
      file.originalname === 'blob'
        ? `${file.fieldname}-${Date.now()}.${fileType}`
        : `${file.originalname.split('.')[0]}-${Date.now()}.${fileType}`,
    );
  },
});
