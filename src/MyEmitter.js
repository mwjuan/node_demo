const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
	//有参数
	push(a, b) {
		this.emit('param', a, b);
	}

	//无参数
	pushNoParam() {
		this.emit('event');
	}
}

module.exports = MyEmitter;