import HttpException from './HttpException';

export class InvalidRefreshToken extends HttpException {
  constructor(message: string = 'Invalid refresh token') {
    super(401, message);
  }
}
