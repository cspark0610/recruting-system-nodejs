import HttpException from './HttpException';

export default class AuthenticationTokenMissingExeption extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
