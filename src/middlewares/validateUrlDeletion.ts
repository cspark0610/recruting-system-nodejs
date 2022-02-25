import { Request, Response, NextFunction } from 'express';
import Url from '../db/schemas/Url.schema';

export default async function validateUrlDeletion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { url_id } = req.params;

    const url = await Url.findOne({ short_url: url_id });

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
