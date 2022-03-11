/* eslint-disable operator-linebreak */
import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import dotenv from 'dotenv';
import * as videoService from '../services/Video.service';

dotenv.config();

const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  process.env;

const unlinkFile = promisify(unlink);

export const generateUniqueUrl = async (_req: Request, res: Response) => {
  try {
    const data = await videoService.GenerateUrl();

    if (!data) {
      return res
        .status(500)
        .send({ message: 'There was an error. Please try again.' });
    }

    return res.status(201).send({
      message: 'url created',
      client_url:
        NODE_ENV === 'development'
          ? `${REDIRECT_URL_DEVELOPMENT}/url/validate?id=${data.short_url}`
          : `${REDIRECT_URL_PRODUCTION}/url/validate?id=${data.short_url}`,
    });
  } catch (e) {
    return res.send(e);
  }
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

    return res.send({
      message: 'video uploaded successfully',
    });
  } catch (e: any) {
    return new Error(e);
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  const { url_id } = req.params;

  await videoService.DeleteUrl(url_id);

  return res.status(200).send({
    message: 'Url deleted successfully',
  });
};
