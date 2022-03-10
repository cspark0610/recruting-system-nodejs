import { Request, Response, NextFunction } from 'express';
import UniqueUrl from '../../db/schemas/UniqueUrl.schema';
import Candidate from '../../db/schemas/Candidate.schema';
import IUrl from '../../interfaces/schemas/IUniqueUrl.interface';
import ICandidate from '../../interfaces/schemas/ICandidate.interface';
import temp from '../../lib/tempVariables';

export default async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const short_url = req.query.id as string;

    if (!short_url) {
      return res.status(400).render('pages/urlNotValid');
    }

    const uniqueUrl: IUrl | null = await UniqueUrl.findOne({ short_url });

    if (!uniqueUrl) {
      return res.status(404).render('pages/urlNotValid');
    }

    temp.url_id = uniqueUrl.short_url;

    next();
  } catch (e: any) {
    return new Error(e);
  }
}
