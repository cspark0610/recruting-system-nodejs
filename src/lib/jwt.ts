/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import envConfig from '../config/env';
import TokenData from '../interfaces/TokenData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import { IUser } from '../db/schemas/interfaces/User';

const { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = envConfig;

export function createToken(
  data: IUser | ICandidate,
  expiresIn: string,
  tokenType: string,
  short_url?: string,
): TokenData {
  const dataStoredInToken: DataStoredInToken = {
    _id: data._id as string,
    url_id: short_url as string,
  };

  if (tokenType === 'access') {
    return {
      token: jwt.sign(dataStoredInToken, JWT_ACCESS_TOKEN_SECRET, {
        expiresIn,
      }),
    };
  }

  return {
    token: jwt.sign(dataStoredInToken, JWT_REFRESH_TOKEN_SECRET, { expiresIn }),
  };
}

export function decodeToken(
  token: string,
  tokenType: string,
): DataStoredInToken {
  if (tokenType === 'access') {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as DataStoredInToken;
  }

  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as DataStoredInToken;
}
