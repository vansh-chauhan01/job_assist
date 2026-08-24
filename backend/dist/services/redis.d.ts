import type { RedisClientType } from "redis";
declare const connectToRedis: () => Promise<RedisClientType | null>;
declare const getCache: (key: string) => Promise<any>;
declare const setCache: (key: string, value: any, expireTime?: number) => Promise<true | null>;
declare const deleteCache: (key: string) => Promise<boolean | undefined>;
export { connectToRedis, getCache, setCache, deleteCache };
//# sourceMappingURL=redis.d.ts.map