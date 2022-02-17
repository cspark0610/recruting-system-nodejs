import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import User from '../db/schemas/User.schema';
import * as videoService from '../services/Video.service';

import temp from '../lib/tempVariables';

const unlinkFile = promisify(unlink);

export const getVideo = (_req: Request, res: Response) => {
  res.render('pages/viewVideo');
};

export const getVideoFromS3 = (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const candidateVideo = videoService.GetVideoFromS3(key);

    if (!candidateVideo) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'Video not found',
      });
    }

    candidateVideo.pipe(res);
  } catch (e: any) {
    return new Error(e);
  }
};

export const uploadVideoToS3 = async (req: Request, res: Response) => {
  try {
    const newCandidateVideo = req.file;

    if (!newCandidateVideo) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: 'No video file was received',
      });
    }

    const result = await videoService.UploadVideoToS3(newCandidateVideo);

    await unlinkFile(newCandidateVideo.path);

    console.log(result);

    console.log(temp);
    temp.video_key = result?.Key;
    console.log(temp);

    const user = await User.findOneAndUpdate(
      { id: temp.userId },
      { video_key: temp.video_key },
    );
    await user.save();
    console.log(user);

    res.send({
      status: 'uploaded successfully',
      video_key: result?.Key,
    });
  } catch (e: any) {
    return new Error(e);
  }
};
