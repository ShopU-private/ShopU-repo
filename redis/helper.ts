// ================= Cache Helper ==========================

import { getRedisClient } from "./redisClient";

const redis = getRedisClient();

export const cache = {
  /**
   *
   * @param key -> cache key
   * @returns  -> get a value from cache
   */

  async get<T = string>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.log(error)
        return value as T;
      }
    } catch (error) {
      console.log(`Redis GET error for keys ${key}: `, error);
      return null;
    }
  },

  /**
   *
   * @param key -> cache key
   * @param value -> value to cache (will be json stringified if not a string)
   * @param ttl -> time to live in seconds (optional)
   * @returns
   */

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error(`Redis SET error for key ${key}: `, error);
      return false;
    }
  },

  /**
   *
   * @param key -> cache key
   * @returns -> delete a key from cache
   */

  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      console.error(`Redis DELETE error for key ${key}: `, error);
      return false;
    }
  },

  /**
   *
   * @param keys - cache key
   * @returns - delete multiple keys
   */

  async deleteMany(keys: string[]): Promise<number> {
    try {
      if (keys.length === 0) return 0;
      return await redis.del(...keys);
    } catch (error) {
      console.error(`Redis DELETE MANY error for key ${keys}: `, error);
      return 0;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS error for keys: ${key}: `, error);
      return false;
    }
  },

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXPIRES error for keys ${key}: `, error);
      return false;
    }
  },

  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Redis TTL error for keys ${key}: `, error);
      return -2;
    }
  },

  async getAndDelete<T = string>(key: string): Promise<T | null> {
    try {
      const value = await redis.getdel(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.log(error)
        return value as T;
      }
    } catch (error) {
      console.error(`Redis GETDEL error for keys ${key}: `, error);
      return null;
    }
  },

  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, by);
    } catch (error) {
      console.error(`Redis INCRBY error for key ${key}: `, error);
      throw error;
    }
  },

  async decrement(key: string, by: number = 1): Promise<number> {
    try {
      return await redis.decrby(key, by);
    } catch (error) {
      console.error(`Redis DECRBY error for key ${key}: `, error);
      throw error;
    }
  },
};

// =================== Publisher / Subscriber Helper ======================

export const pubsub = {
  async publish(channel: string, message: string): Promise<number> {
    try {
      return await redis.publish(channel, message);
    } catch (error) {
      console.error(`Redis PUBLISH error for channel ${channel}: `, error);
      throw error;
    }
  },

  async subscribe(
    channels: string | string[],
    callback: (channel: string, message: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const subscriber = redis.duplicate();
        const channelArray = Array.isArray(channels) ? channels : [channels];

        subscriber.subscribe(...channelArray, err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });

        subscriber.on('message', (channel, message) => {
          callback(channel, message);
        });

        subscriber.on('error', err => {
          console.error('Redis subscriber error: ', err);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};
