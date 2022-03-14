import HttpException from './HttpException';

class BadRequestException extends HttpException {
  constructor(message: string | string[]) {
    super(400, message as string);
  }
}

export default BadRequestException;
