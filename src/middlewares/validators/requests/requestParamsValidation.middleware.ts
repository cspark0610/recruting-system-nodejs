import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import BadRequestException from '../../../exceptions/BadRequestException';

function validationMiddleware<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.params)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(
            new BadRequestException(
              message.split(',').map((err) => err.trim()),
            ),
          );
        } else {
          next();
        }
      },
    );
  };
}

export default validationMiddleware;
