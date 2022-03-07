import { Request, Response, NextFunction } from 'express';
import Url from '../../db/schemas/Url.schema';
import IUrl from '../../interfaces/IUrl.interface';

export default async function validateUrlDeletion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const short_url = req.params.url_id;

    if (!short_url) {
      return res.status(400).send('No url id was received');
    }

    const url: IUrl | null = await Url.findOne({ short_url });

    if (!url) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        message:
          'Url not found. Probably already deleted or has not been created',
      });
    }

    next();
  } catch (e) {
    console.error(e);
  }
}
