import { REDIS_URL } from '@/config';
import { Redis } from 'ioredis';

const getRedisUrl = () => {
  if (REDIS_URL) {
    return REDIS_URL;
  }
  
  throw new Error('REDIS_URL is not defined');
};

export const redis = new Redis(getRedisUrl());