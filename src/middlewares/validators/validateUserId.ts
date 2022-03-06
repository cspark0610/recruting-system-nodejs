import { Request, Response, NextFunction } from 'express';
import Candidate from '../../db/schemas/Candidate.schema';
import ICandidate from '../../interfaces/ICandidate.interface';
import temp from '../../lib/tempVariables';

export default async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).send('No candidate id was received');
    }

    const candidate: ICandidate | null = await Candidate.findOne({
      id: candidateId,
    });

    if (!candidate) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: `Candidate not found with id ${candidateId}`,
      });
    }

    if (candidate.videos_question_list.length !== 3) {
      const recordedVideos = candidate.videos_question_list.length;

      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: `Candidate has been found, but has not recorded all their videos. Currently they have recorded ${recordedVideos} out of 3`,
      });
    }

    temp.video_data = candidate.videos_question_list;
    temp.cv = candidate.cv;

    next();
  } catch (e: any) {
    console.error(e);
  }
}
