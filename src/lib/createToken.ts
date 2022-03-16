/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../db/schemas/interfaces/User';
import TokenData from '../interfaces/TokenData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';

dotenv.config();

const { JWT_SECRET } = process.env;

export default function createToken(
  data: IUser | ICandidate,
  short_url?: string,
): TokenData {
  const secret = JWT_SECRET as string;

  const dataStoredInToken: DataStoredInToken = {
    _id: data._id as string,
    url_id: short_url as string,
  };

  return {
    token: jwt.sign(dataStoredInToken, secret),
  };
}
