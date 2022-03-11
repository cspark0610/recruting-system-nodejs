import { Request, Response, NextFunction } from 'express';
import temp from '../../lib/tempVariables';
import Url from '../../db/schemas/UniqueUrl.schema';
import IUrl from '../../interfaces/schemas/IUrl.interface';

export default async function validateBaseUrl(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const url: IUrl | null = await Url.findOne({ short_url: temp.url_id });

  if (!url) {
    return res.status(400).render('pages/urlNotValid');
  }

  next();
}
