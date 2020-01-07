const Redis = require('ioredis');
const debug = require('debug')('shgbit:service:redis');

class RedisService {
	open() {
		this.redis = new Redis({ lazyConnect: true });
		this.redis.on('ready', () => {
			this.redis.config('SET', 'notify-keyspace-events', 'Ex');
		});

		this.redis.connect(() => {
			debug('ioredis OK');
		}).catch(() => {
			debug('error: missing redis');
			shell.exit(1);
		});
		//this.redis.set("foo", "bar");
	}

	close() {
		debug('redis service closed');
		this.redis.quit();
	}
}

module.exports = new RedisService();