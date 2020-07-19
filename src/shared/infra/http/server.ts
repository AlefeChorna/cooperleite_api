import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ValidationError } from 'joi';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import pagination from './middlewares/pagination';
import routes from './routes';
import formatJoiError from '../../utils/formatJoiError';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(rateLimiter)
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(pagination);
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: err.statusCode,
      type: 'error',
      messages: err.message,
    });
  }

  // @ts-ignore
  if (err.isJoi) {
    return response.status(422).json({
      status: 422,
      type: 'error',
      messages: formatJoiError(err as ValidationError),
    });
  }

  console.error('[API_ERROR]', err);

  return response.status(500).json({
    status: 500,
    message: 'Internal server error',
    err
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
