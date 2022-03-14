import HttpException from './HttpException';

export default class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(403, message);
  }
}
