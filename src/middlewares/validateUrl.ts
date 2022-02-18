import { Request, Response, NextFunction } from 'express';
import Url from '../db/schemas/Url.schema';
import temp from '../lib/tempVariables';

export default async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.query.id as string;
    const index = req.query.index as string;

    const uniqueUrl = await Url.findOne({ short_url: id });

    if (!uniqueUrl || Object.entries(uniqueUrl).length === 0) {
      return res.status(404).render('pages/urlNotValid');
    }

    temp.index = index;

    next();
  } catch (e: any) {
    return new Error(e);
  }
}
