import { Request, Response } from 'express';
import dotenv from 'dotenv';

import path from 'path';
import * as urlService from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;

    const { newUrl, newUser } = await urlService.GenerateUrl(userId);

    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'url created',
      url:
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3001/url/validate?id=${newUrl.short_url}&index=${newUser.index}`
          : `${process.env.REDIRECT_URL}/url/validate?id=${newUrl.short_url}&index=${newUser.index}`,
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

  return res.send({
    status: 'success',
    code: 200,
    message: 'Url deleted successfully',
  });
};
