import HttpException from './HttpException';

export class ForbiddenException extends HttpException {
  constructor(
    message: string = 'You do not have the necessary permissions to execute this action',
  ) {
    super(403, message);
  }
}
