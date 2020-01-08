const App = require('./App');
let app = new App();
const MyEmitter = require('./MyEmitter')
const myEmitter = new MyEmitter();
const logger = require('./Logger')

let main = async () => {
	logger.log('info', 'main open')

	myEmitter.on('param', (a, b) => {
		logger.log('info', 'an event occurred!' + a + b);
	});

	myEmitter.on('event', () => {
		logger.log('info', 'an event no param occurred!');
	})

	myEmitter.push(1, 2);
	myEmitter.pushNoParam();
	await app.open();
	await app.openws();
	await app.openMqTT();
}

process.on('SIGINT', function () {
	app.close();
	logger.log('info', 'main closed');
});

main();
