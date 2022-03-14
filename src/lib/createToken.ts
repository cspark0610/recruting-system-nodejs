/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IUser from '../db/interfaces/User/IUser.interface';
import TokenData from '../interfaces/TokenData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken.interface';

dotenv.config();

const { JWT_SECRET } = process.env;

export default function createToken(user: IUser): TokenData {
  const secret = JWT_SECRET as string;

  const dataStoredInToken: DataStoredInToken = {
    _id: user._id as string,
  };

  return {
    token: jwt.sign(dataStoredInToken, secret),
  };
}
