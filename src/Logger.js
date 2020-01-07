const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const strip = require('strip-color');
require('winston-daily-rotate-file');

const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.splat(),
		format.timestamp({ format: () => moment().unix() }),
		format.errors({ stack: true }),
		format.simple()
	),
	transports: [
		new transports.Console(),
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
})


module.exports = logger;