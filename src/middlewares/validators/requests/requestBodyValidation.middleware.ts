import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import BadRequestException from '../../../exceptions/BadRequestException';

function requestBodyValidation<T>(type: any): express.RequestHandler {
  return (req, _res, next) => {
    validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(error.constraints as { [type: string]: string }),
          )
          .join(', ');
        next(
          new BadRequestException(message.split(',').map((err) => err.trim())),
        );
      } else {
        next();
      }
    });
  };
}

export default requestBodyValidation;
