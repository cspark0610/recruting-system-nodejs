/* eslint-disable import/prefer-default-export */
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import { BadRequestException } from '../../../exceptions';

export function requestParamsValidation<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.params)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values(error.constraints as { [type: string]: string }),
            )
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
