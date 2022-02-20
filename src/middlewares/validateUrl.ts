import { Request, Response, NextFunction } from 'express';
import Url from '../db/schemas/Url.schema';
import IUrl from '../interfaces/IUrl.interface';
import User from '../db/schemas/User.schema';
import IUser from '../interfaces/IUser.interface';
import temp from '../lib/tempVariables';

export default async function validateUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.query.id as string;
    const index = req.query.index as string;

    const uniqueUrl: IUrl | null = await Url.findOne({ short_url: id });
    const uniqueUser: IUser | null = await User.findOne({ index });

    if (!uniqueUrl || !uniqueUser) {
      return res.status(404).render('pages/urlNotValid');
    }

    temp.index = index;

    next();
  } catch (e: any) {
    return new Error(e);
  }
}
