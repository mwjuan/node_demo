const config = require('config');
const mongoose = require('mongoose');
const debug = require('debug')('app:db');

mongoose.connection.on('connected', function () {
	debug('Mongoose default connection open to ' + config.db);
});

mongoose.connection.on('error', function (err) {
	debug('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	debug('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		debug('Mongoose default connection closed through app termination');
		process.exit(0);
	});
});

class Mongodb {
	constructor(conn) {
		this.conn = conn;
		this.mongoose = mongoose;
		this.options = {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true
		};
	}

	open() {
		return this.connect();
	}

	connect() {
		return this.mongoose.connect(this.conn, this.options);
	}

	close() {
		return this.mongoose.connection.close();
	}

	drop() {
		this.mongoose.connection.dropDatabase();
	}
}

module.exports = new Mongodb(config.db);