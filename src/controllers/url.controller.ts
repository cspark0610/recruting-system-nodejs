import { Request, Response } from 'express';
import dotenv from 'dotenv';

import * as urlService from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.redirect('/');
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const candidateId = req.query.candidate_id as string;
    const { questions } = req.body;

    const data = await urlService.GenerateUrl(candidateId, questions);

    if (!data?.newUrl || !data?.newCandidate) {
      return res
        .status(500)
        .send({ message: 'There was an error. Please try again.' });
    }

    return res.status(201).send({
      message: 'url created',
      client_url:
        process.env.NODE_ENV === 'development'
          ? `${process.env.REDIRECT_URL_DEVELOPMENT}/url/validate?id=${data.newUrl.short_url}&index=${data.newCandidate.id}`
          : `${process.env.REDIRECT_URL_PRODUCTION}/url/validate?id=${data.newUrl.short_url}&index=${data.newCandidate.id}`,
      watch_videos_url:
        process.env.NODE_ENV === 'development'
          ? `${process.env.REDIRECT_URL_DEVELOPMENT}/video/view/${data.newCandidate.id}`
          : `${process.env.REDIRECT_URL_PRODUCTION}/video/view/${data.newCandidate.id}`,
    });
  } catch (e) {
    return res.send(e);
  }
};

export const renderNotValidUrl = (_req: Request, res: Response) =>
  res.status(404).render('pages/urlNotValid');

export const deleteUrl = async (req: Request, res: Response) => {
  const { url_id } = req.params;

  await urlService.DeleteUrl(url_id);

  return res.status(200).send({
    message: 'Url deleted successfully',
  });
};
