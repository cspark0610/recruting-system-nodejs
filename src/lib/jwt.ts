/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from '../db/schemas/interfaces/User';
import envConfig from '../config/env';
import TokenData from '../interfaces/TokenData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_VIDEO_TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
} = envConfig;

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

  if (tokenType === 'video') {
    return {
      token: jwt.sign(dataStoredInToken, JWT_VIDEO_TOKEN_SECRET, {
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

  if (tokenType === 'video') {
    return jwt.verify(token, JWT_VIDEO_TOKEN_SECRET) as DataStoredInToken;
  }

  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as DataStoredInToken;
}

export const verifyGoogleToken = async (token: string) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
};
