import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: string;
  config: {
    redis: RedisOptions
  };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD ?? undefined,
    }
  }
} as ICacheConfig
