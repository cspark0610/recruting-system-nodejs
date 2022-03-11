import { Request, Response } from 'express';
import dotenv from 'dotenv';

import * as urlService from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.redirect('/');
};

export const generateUniqueUrl = async (_req: Request, res: Response) => {
  try {
    const data = await urlService.GenerateUrl();

    if (!data) {
      return res
        .status(500)
        .send({ message: 'There was an error. Please try again.' });
    }

    return res.status(201).send({
      message: 'url created',
      client_url:
        process.env.NODE_ENV === 'development'
          ? `${process.env.REDIRECT_URL_DEVELOPMENT}/url/validate?id=${data.short_url}`
          : `${process.env.REDIRECT_URL_PRODUCTION}/url/validate?id=${data.short_url}`,
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
