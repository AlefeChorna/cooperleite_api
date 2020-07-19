import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

type Record<K extends keyof any, T> = {
  [P in K]?: T;
};

type RequestValidatorParams = Record<'body' | 'params' | 'query', ObjectSchema>;

export default function requestValidator(validation: RequestValidatorParams) {
  const middleware = function (req: Request, res: Response, next: NextFunction) {
    try {
      const { body, params } = req;

      if (validation?.body && body) {
        const { error } = validation.body.validate(body, { abortEarly: false });
        if (error) return next({...error, isJoi: error?.isJoi });
      }
      if (validation?.params && params) {
        const { error } = validation.params.validate(params, { abortEarly: false });
        if (error) return next(error);
      }

      return next();
    } catch(err) {
      return next(err);
    }
  }

  return middleware;
}
