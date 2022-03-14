import HttpException from './HttpException';

export default class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(401, message);
  }
}
