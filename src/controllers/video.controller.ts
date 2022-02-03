import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import uploadVideoToS3 from '../services/Video.service';

const unlinkFile = promisify(unlink);

const saveVideoToS3 = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file was received');
    }

    const result = await uploadVideoToS3(file);

    console.log(file);
    await unlinkFile(file.path);

    console.log(result);

    res.send('upload successfully');
  } catch (e) {
    console.error(e);
  }
};

export default saveVideoToS3;
