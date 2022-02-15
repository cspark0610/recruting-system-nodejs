import { Request, Response } from 'express';
import dotenv from 'dotenv';

import GenerateUrl from '../services/Url.service';

dotenv.config();

export const validateUrl = (_req: Request, res: Response) => {
  res.render('pages/index')
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const { redirect_url } = req.body;

    if (!redirect_url) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        mesage: 'No redirect_url was received',
      });
    }

    const newUrl = await GenerateUrl(redirect_url);
    console.log(newUrl);

    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'url created',
      url: `${redirect_url}/url/validate?id=${newUrl.short_url}`,
    });
  } catch (e) {
    return res.send(e);
  }
};

export const renderNotValidUrl = (_req: Request, res: Response) => res.status(404).render('pages/urlNotValid');
