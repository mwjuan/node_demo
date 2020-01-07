const App = require('../src/App');
const config = require('config');
const requesta = require('axios').create({ baseURL: `http://localhost:${config.get('port')}`, maxRedirects: 0 });
const request = require('supertest')(`http://localhost:${config.get('port')}`);
const sinon = require('sinon');
require('chai').should();

console.log(config.get('port'));
describe('App.js', () => {
	let app = new App();

	before(async () => {
		await app.open();
	});

	after(async () => {
		await app.close();
	});

	//以下为两种写法
	it('get /', done => {
		request.get('/')
			.expect(200, done);
	});

	it('get /', async () => {
		let response = await requesta.get('/');
		response.status.should.eq(200);
		response.data.should.eq('hi, node test demo');
	});

});