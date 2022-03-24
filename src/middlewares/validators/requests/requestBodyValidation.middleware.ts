/* eslint-disable import/prefer-default-export */
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { unlink } from 'fs';
import { promisify } from 'util';
import * as express from 'express';
import BadRequestException from '../../../exceptions/BadRequestException';

const unlinkFile = promisify(unlink);

export function requestBodyValidation<T>(type: any): express.RequestHandler {
  return (req, _res, next) => {
    const cv = req.file as Express.Multer.File;
    validate(plainToClass(type, req.body)).then(
      async (errors: ValidationError[]) => {
        if (errors.length > 0) {
          await unlinkFile(cv.path);
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
