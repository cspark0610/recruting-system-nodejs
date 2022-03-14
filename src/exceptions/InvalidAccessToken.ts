import HttpException from './HttpException';

export default class InvalidAccessToken extends HttpException {
  constructor(message: string) {
    super(401, message);
  }
}
