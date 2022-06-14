import jwt from 'jsonwebtoken';
import { envConfig } from '../config';
import { DataStoredInToken } from '../interfaces';

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_VIDEO_TOKEN_SECRET,
} = envConfig;

export const jwtOptsSign = {
  access(dataStoredInToken: DataStoredInToken, expiresIn: string) {
    return jwt.sign(dataStoredInToken, JWT_ACCESS_TOKEN_SECRET, { expiresIn });
  },

  video(dataStoredInToken: DataStoredInToken, expiresIn: string) {
    return jwt.sign(dataStoredInToken, JWT_VIDEO_TOKEN_SECRET, { expiresIn });
  },

  refresh(dataStoredInToken: DataStoredInToken, expiresIn: string) {
    return jwt.sign(dataStoredInToken, JWT_REFRESH_TOKEN_SECRET, { expiresIn });
  },
};

export const jwtOptsDecode = {
  access(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as DataStoredInToken;
  },

  video(token: string) {
    return jwt.verify(token, JWT_VIDEO_TOKEN_SECRET) as DataStoredInToken;
  },

  refresh(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as DataStoredInToken;
  },
};
