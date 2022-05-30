import HttpException from './HttpException';

export class InvalidAccessToken extends HttpException {
  constructor(message: string = 'Invalid access token') {
    super(401, message);
  }
}
