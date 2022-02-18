import { Request, Response } from 'express';
import dotenv from 'dotenv';

import GenerateUrl from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.render('pages/index');
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const { redirect_url } = req.params;
    const userId = req.query.userId as string;

    if (!redirect_url) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        mesage: 'No redirect_url was received',
      });
    }

    const data = await GenerateUrl(redirect_url, userId);

    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'url created',
      url: `${process.env.REDIRECT_URL}/url/validate?id=${data.newUrl.short_url}&index=${data.newUser.index}`,
    });
  } catch (e) {
    return res.send(e);
  }
};

export const renderNotValidUrl = (_req: Request, res: Response) => res.status(404).render('pages/urlNotValid');
