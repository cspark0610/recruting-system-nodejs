import { Request, Response } from 'express';
import dotenv from 'dotenv';

import GenerateUrl from '../services/Url.service';

import temp from '../lib/tempVariables';

dotenv.config();

export const validateUrl = (_req: Request, res: Response) => {
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

    const newUrl = await GenerateUrl(redirect_url, userId);
    console.log(newUrl);

    temp.userId = userId;

    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'url created',
      url: `${process.env.REDIRECT_URL}/url/validate?id=${newUrl.short_url}`,
    });
  } catch (e) {
    return res.send(e);
  }
};

export const renderNotValidUrl = (_req: Request, res: Response) => res.status(404).render('pages/urlNotValid');
