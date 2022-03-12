import User from '../db/schemas/User.schema';
import IUser from '../db/interfaces/User/IUser.interface';

export const SignUp = async (userInfo: IUser) => {
  try {
    const hashedPassword = await User.hashPassword(userInfo.password, 12);

    const newUser = await User.create({
      ...userInfo,
      password: hashedPassword,
    });

    return newUser;
  } catch (e) {
    console.error(e);
  }
};

export const SignIn = async (userInfo: IUser) => {
  try {
    const userFound = await User.findOne({ email: userInfo.email });

    return userFound;
  } catch (e: any) {
    console.error(e);
  }
};
