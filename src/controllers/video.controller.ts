import { Request, Response } from 'express';
import { createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import { UploadVideoToS3, GetVideoFromS3 } from '../services/Video.service';

const unlinkFile = promisify(unlink);

export const getVideoFromS3 = (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const candidateVideo = GetVideoFromS3(key);

    if (!candidateVideo) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'Video not found',
      });
    }

    const stream = createWriteStream(`./downloads/${key}`);

    candidateVideo.pipe(stream);

    res.send('success');
  } catch (e: any) {
    return new Error(e);
  }
};

export const uploadVideoToS3 = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file was received');
    }

    const result = await UploadVideoToS3(file);

    console.log(file);
    await unlinkFile(file.path);

    console.log(result);

    res.send({
      status: 'uploaded successfully',
      videoKey: result?.Key,
    });
  } catch (e: any) {
    return new Error(e);
  }
};
