import { Request, Response } from 'express';
import dotenv from 'dotenv';

import * as urlService from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.redirect('/', 200);
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    const { questions } = req.body;

    const data = await urlService.GenerateUrl(userId, questions);

    if (!data?.newUrl || !data?.newUser) {
      return res
        .status(500)
        .send({ message: 'There was an error. Please try again.' });
    }

    return res.status(201).send({
      message: 'url created',
      client_url:
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3001/url/validate?id=${data.newUrl.short_url}&index=${data.newUser.index}`
          : `${process.env.REDIRECT_URL}/url/validate?id=${data.newUrl.short_url}&index=${data.newUser.index}`,
      watch_videos_url:
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3001/video/view/${data.newUser.id}`
          : `${process.env.REDIRECT_URL}/video/view/${data.newUser.id}`,
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
