import { Request, Response } from 'express';
import temp from '../lib/tempVariables';

const getKeys = (_req: Request, res: Response) => {
  res.send(temp);
};

export default getKeys;
