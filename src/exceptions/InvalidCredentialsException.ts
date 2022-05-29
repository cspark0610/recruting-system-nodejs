import HttpException from './HttpException';

export class InvalidCredentialsException extends HttpException {
  constructor(message: string = 'Invalid email or password') {
    super(400, message);
  }
}
