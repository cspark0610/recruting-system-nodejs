import { Request, Response } from 'express';
import IUser from '../db/interfaces/User/IUser.interface';
import SignUp from '../services/User.service';

const signUp = async (req: Request, res: Response) => {
  try {
    const userInfo: IUser = req.body;
    const user = await SignUp(userInfo);

    return res.status(201).send(user);
  } catch (e: any) {
    return { message: e.message };
  }
};

export default signUp;
