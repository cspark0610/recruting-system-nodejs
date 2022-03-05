import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import * as videoService from '../services/Video.service';

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

    const { candidate_id } = req.params;
    const { question_id } = req.body;

    if (!newCandidateVideo) {
      return res.status(400).send({
        message: 'No video file was received',
      });
    }

    const result = await videoService.UploadVideoToS3(newCandidateVideo);

    await unlinkFile(newCandidateVideo.path);

    await videoService.SaveVideoKeyToUser(
      question_id,
      candidate_id,
      result?.Key,
    );

    res.send({
      message: 'video uploaded successfully',
    });
  } catch (e: any) {
    return new Error(e);
  }
};
