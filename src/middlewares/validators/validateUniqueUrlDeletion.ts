import { Request, Response, NextFunction } from 'express';
import VideoRecordingUrl from '../../db/schemas/VideoRecordingUrl.schema';
import IVideoRecordingUrl from '../../db/interfaces/IVideoRecordingUrl.interface';

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

    const url: IVideoRecordingUrl | null = await VideoRecordingUrl.findOne({
      short_url,
    });

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
