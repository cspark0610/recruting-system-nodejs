import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { GetUniqueUrl, GenerateUrl } from '../services/Url.service';

export const getUniqueUrl = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;

    const uniqueUrlId = await GetUniqueUrl(id);

    if (!uniqueUrlId || Object.entries(uniqueUrlId).length === 0) {
      return res.status(404).redirect('validate/error/not-valid');
    }

    res.redirect(uniqueUrlId.redirect_url);
  } catch (e) {
    return res.send(e);
  }
};

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const { redirect_url } = req.body;

    if (!redirect_url) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        mesage: 'No base url was received',
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

export const renderNotValidUrl = (_req: Request, res: Response) => {
  return res.status(404).render('pages/urlNotValid');
};
