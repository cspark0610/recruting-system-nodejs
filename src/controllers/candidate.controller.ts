/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import dotenv from 'dotenv';
import ICandidate from '../db/interfaces/ICandidate.interface';
import * as candidateService from '../services/Candidate.Service';

dotenv.config();

const unlinkFile = promisify(unlink);

const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  process.env;

export const createCandidate = async (req: Request, res: Response) => {
  const cv = req.file;
  const { id, name, email, phone, country }: ICandidate = req.body;

  if (!cv) {
    return res.status(400).send('no cv received');
  }

  try {
    const result = await candidateService.UploadCV(cv);
    await unlinkFile(cv.path);

    const cvKey = result?.Key;

    const data = await candidateService.CreateCandidate({
      id,
      name,
      email,
      phone,
      country,
      cv: cvKey,
    });

    if (!data) {
      return res.status(500).send({
        message: 'There was an error creating the candidate. Please try again',
      });
    }

    return res.status(201).send(data);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export const generateUniqueUrl = async (_req: Request, res: Response) => {
  try {
    const data = await candidateService.GenerateUrl();

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

    const candidateVideo = candidateService.GetVideoFromS3(key);

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

    const result = await candidateService.UploadVideoToS3(newCandidateVideo);

    await unlinkFile(newCandidateVideo.path);

    await candidateService.SaveVideoKeyToUser(
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

  await candidateService.DeleteUrl(url_id);

  return res.status(200).send({
    message: 'Url deleted successfully',
  });
};

export const getCV = async (req: Request, res: Response) => {
  const { key } = req.params;

  try {
    const candidateCV = await candidateService.GetCV(key);

    if (!candidateCV) {
      return res.status(404).send({ message: 'No cv found' });
    }

    candidateCV.pipe(res);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};
