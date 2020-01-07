
const Koa = require('koa');
const debug = require('debug')("app");
const config = require('config');
const router = require('./router');
const koaWinston = require('./koa-winston');
const views = require('koa-views');
const path = require('path');
const { userAgent } = require("koa-useragent");
const redisService = require('./redis')
const http = require('http');
const WebSocket = require('ws');
const mqttService = require('./MqTTServer')
const db = require('./db')
const logger = require('./Logger')

class App {
	async openws() {
		// const WebSocketApi = require('./ws');//引入封装的ws模块
		// this.server = http.createServer(this.koa.callback())
		// const wss = new WebSocket.Server({// 同一个端口监听不同的服务
		// 	server: this.server
		// });
		// WebSocketApi(wss)
		// this.server.listen(config.get('port'))
	}

	async openMqTT() {
		this.mqtt = new mqttService();
		this.mqtt.open();
	}

	async	open() {
		debug("open");
		this.koa = new Koa();
		// this.koa.use(logger())
		this.koa.use(koaWinston(logger))
			.use(views(path.join(__dirname, 'views'), { extension: 'hbs', map: { hbs: 'handlebars' } }))
			// .use(userAgent)
			.use(router.routes())
			.use(router.allowedMethods());

		redisService.open();
		db.connect();

		return new Promise((resolve, reject) => {
			this.server = this.koa.listen(config.get('port'), () => {
				debug('server started, port:', config.get('port'));
				resolve();
			});
		});
	}

	close() {
		debug("close");
		this.server.close();
		db.close();
	}
}

module.exports = App;