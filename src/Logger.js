const config = require('config');
const moment = require('moment');
const path = require('path');
const util = require('util');
const stackTrace = require('stack-trace');
const strip = require('strip-color');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

class Logger {
	constructor() {
		this.name = 'node logger';
		this.init();
	}

	child(options) {
		let child = this.logger.child(options);
		Object.keys(this.logger.levels).forEach(level => {
			if (level !== 'log') {
				child[level] = (...args) => {
					return child.log(level, ...args);
				};
			}
		});
		return child;
	}

	log(level, msg, ...splat) {
		let args = [level];

		if (msg && typeof msg === 'object') {
			if (msg.message) {
				args.push('');
			}
		}
		args.push(msg);

		return this._log(args, splat);
	}

	_log(args, ...splat) {
		return this.logger.log(...args, ...splat, this.getCallerInfo());
	}

	getCallerInfo() {
		let level = stackTrace.get().length;
		let frame;
		for (let i = 0; i < level; ++i) {
			let current = stackTrace.get()[i];
			if (__filename != current.getFileName()) {
				frame = current;
				break;
			}
		}

		if (frame) {
			let filename = frame.getFileName();
			let base = path.dirname(require.main.filename);
			filename = filename.replace(base, '').slice(1);
			let line = frame.getLineNumber();
			return { filename, line };
		}

		return null;
	}

	init() {
		this.logger = createLogger({
			level: 'debug',
			format: format.combine(
				format.errors({ stack: true }),
				format.splat(),
				format.prettyPrint(),
				format.timestamp({ format: () => moment().unix() }),
				format.label(`app`),
				format.errors({ stack: true })
			),
			transports: [
				new (transports.DailyRotateFile)({
					level: 'debug',
					json: true,
					filename: 'logs/app-%DATE%.log',
					datePattern: 'YYYY-MM-DD-HH',
					zippedArchive: false,
					maxSize: '20m',
					maxFiles: '14d',
					format: format.combine(
						format(info => {
							info.message = strip(info.message);
							return info;
						})(),
						format.json()
					)
				})
			]
		});

		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(new transports.Console({
				level: 'debug',
				format: format.combine(
					format.colorize(),
					format.printf(info => {
						let content;
						if (info.filename && info.line) {
							content = (info.requestId ? `[req_id: ${info.requestId}]` : '') + `${moment.unix(info.timestamp).format("HH:mm")} ${info.level} [${info.filename}:${info.line}]: ${info.message}`;
						} else {
							content = (info.requestId ? `[req_id: ${info.requestId}]` : '') + `${moment.unix(info.timestamp).format("HH:mm")} ${info.level}: ${info.message}`;
						}
						let base = path.dirname(path.dirname(require.main.filename)) + '/';
						if (info.stack) {
							content += '\n' + info.stack.split(base).join("");
						}
						return content;
					})
				)
			}));
		}

		// 按上debug, info, warn, error handler
		Object.keys(this.logger.levels).forEach(level => {
			if (level !== 'log') {
				this[level] = (...args) => {
					return this.log(level, ...args);
				};
			}
		});
	}
}

module.exports = Logger;