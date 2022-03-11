import User from '../db/schemas/User.schema';
import IUser from '../db/interfaces/User/IUser.interface';

const SignUp = async (userInfo: IUser) => {
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

export default SignUp;
