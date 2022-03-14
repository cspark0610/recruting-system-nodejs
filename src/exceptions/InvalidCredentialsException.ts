import HttpException from './HttpException';

export default class InvalidCredentialsException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}
