const WebSocket = require('ws');
const config = require('config')
const wss = new WebSocket.Server({ port: config.get('port') });

module.exports = ws => {
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			console.log('received: ');
		});
		ws.send('something');
	});
}
