const mosca = require('mosca');

class MqTTServer {
	constructor() {
		this.ascoltatore = {
			//using ascoltatore
			type: 'mongo',
			url: 'mongodb://localhost:27017/mqtt',
			pubsubCollection: 'ascoltatori',
			mongo: {}
		};

		this.settings = {
			port: 1884,
			backend: this.ascoltatore,
			http: { port: 18884 }
		};
	}

	open() {
		this.server = new mosca.Server(this.settings);

		this.server.on('clientConnected', function (client) {
			console.log('client connected', client.id);
		});

		// fired when a message is received
		this.server.on('published', function (packet, client) {
			console.log('Published', packet.payload);
		});

		this.server.on('ready', this.setup);
	}

	// fired when the mqtt server is ready
	setup() {
		console.log('Mosca server is up and running');
	}
}

module.exports = MqTTServer;