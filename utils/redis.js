import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error(err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  async set(key, value, expiration) {
    this.client.set(key, value, 'EX', expiration);
  }

  async del(key) {
    this.client.del(key);
  }
}
const redisClient = new RedisClient();
export default redisClient;
