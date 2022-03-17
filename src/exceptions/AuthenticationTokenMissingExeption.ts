import HttpException from './HttpException';

export default class AuthenticationTokenMissingExeption extends HttpException {
  constructor(message: string = 'No access token provided') {
    super(400, message);
  }
}
