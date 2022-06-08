import Redis, { RedisOptions } from "ioredis";

const config = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
} as RedisOptions;

export const redisPub = new Redis(config);
export const redisSub = new Redis(config);
