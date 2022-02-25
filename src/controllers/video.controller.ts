import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
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

    const { index } = req.params;
    const { question_id, question_title } = req.body;

    if (!newCandidateVideo) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: 'No video file was received',
      });
    }

    const result = await videoService.UploadVideoToS3(newCandidateVideo);

    await unlinkFile(newCandidateVideo.path);

    console.log(req.body);
    console.log(result);

    temp.video_key = result?.Key;

    await videoService.SaveQuestionAndVideoKeyToUser(
      question_id,
      question_title,
      index,
      temp.video_key,
    );

    res.send({
      status: 'video uploaded successfully',
    });
  } catch (e: any) {
    return new Error(e);
  }
};
