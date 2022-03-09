import { Request, Response, NextFunction } from 'express';
import Url from '../../db/schemas/Url.schema';
import Candidate from '../../db/schemas/Candidate.schema';
import IUrl from '../../interfaces/schemas/IUrl.interface';
import ICandidate from '../../interfaces/schemas/ICandidate.interface';
import temp from '../../lib/tempVariables';

export default async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const short_url = req.query.id as string;
    const index = req.query.index as string;

    if (!short_url || !index) {
      return res.status(400).render('pages/urlNotValid');
    }

    const uniqueUrl: IUrl | null = await Url.findOne({ short_url });
    const uniqueCandidate: ICandidate | null = await Candidate.findOne({
      index,
    });

    if (!uniqueUrl || !uniqueCandidate) {
      return res.status(404).render('pages/urlNotValid');
    }

    temp.candidate_id = uniqueCandidate.id;
    temp.url_id = uniqueUrl.short_url;
    temp.video_data = uniqueCandidate.videos_question_list;

    next();
  } catch (e: any) {
    return new Error(e);
  }
}
