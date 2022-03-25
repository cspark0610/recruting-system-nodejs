/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import envConfig from '../config/env';
import TokenData from '../interfaces/TokenData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import { IUser } from '../db/schemas/interfaces/User';

const { JWT_SECRET } = envConfig;

export function createToken(
  data: IUser | ICandidate,
  short_url?: string,
): TokenData {
  const dataStoredInToken: DataStoredInToken = {
    _id: data._id as string,
    url_id: short_url as string,
  };

  return {
    token: jwt.sign(dataStoredInToken, JWT_SECRET),
  };
}

export function decodeToken(token: string): DataStoredInToken {
  return jwt.verify(token, JWT_SECRET) as DataStoredInToken;
}
