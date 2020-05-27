import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

import AppError from '@shared/errors/AppError';

const redisClient = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST || '',
  password: process.env.REDIS_PASSWORD || '',
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limit-middleware',
  points: 5,
  duration: 1,
  dbName: 'app-rate-limiter'
})

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip)

    return next();
  } catch(err) {
    throw new AppError('Too many requests', 429);
  }
}
