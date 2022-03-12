import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import IUser from '../db/interfaces/User/IUser.interface';
import * as userService from '../services/User.service';

export const signIn = async (req: Request, res: Response) => {
  const userInfo: IUser = req.body;

  try {
    const userFound = await userService.SignIn(userInfo);

    if (!userFound) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    if (!bcrypt.compare(userInfo.password, userFound.password)) {
      return res.status(403).send({ message: 'Invalid email or password' });
    }
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const userInfo: IUser = req.body;
    const user = await userService.SignUp(userInfo);

    return res.status(201).send(user);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};
