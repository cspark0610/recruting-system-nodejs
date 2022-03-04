import { Request, Response, NextFunction } from 'express';

export default function validateUrlCreationParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.query.user_id as string;
  const { questions } = req.body;

  if (!userId && !questions) {
    return res.status(400).send('No candidate information was received.');
  }

  if (!userId) {
    return res.status(400).send('No candidate id was received');
  }

  if (!questions) {
    return res.status(400).send('No questions were received');
  }

  next();
}
