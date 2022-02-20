import { Request, Response } from 'express';
import dotenv from 'dotenv';

import GenerateUrl from '../services/Url.service';

dotenv.config();

export const renderApp = (_req: Request, res: Response) => {
  res.render('pages/index');
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;

    const data = await GenerateUrl(userId);

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
