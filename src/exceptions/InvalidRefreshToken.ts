import HttpException from './HttpException';

export default class InvalidRefreshToken extends HttpException {
  constructor(message: string = 'Invalid refresh token') {
    super(401, message);
  }
}
