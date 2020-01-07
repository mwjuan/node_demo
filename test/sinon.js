require('chai').should();
const debug = require("debug")("app");
const sinon = require('sinon');

describe.skip('hello sinon', () => {
	it('fake', () => {
		let fake = sinon.fake.returns('foo')
		let result = fake();
		result.should.eq('foo');
	});

	it('replace', () => {
		let fake = facke.returns('42');
		sinon.replace(console, 'dir', fake);
		console.dir('apple pie').should.be.eq('42');
	})

	it('spy', () => {
		let foo = () => 'foo';
		let spy = sinon.spy(foo);
		spy('sss');
		debug(spy('sss'))
		spy.called.should.eq(true);
	})

	it('stub', () => {
		let stub = sinon.stub();
		stub('hello');
		stub.firstCall.args[0].should.eq('hello')
	})

	it('mock', () => {
		let hello = {
			foo: () => 'foo',
			bar: (arg) => arg
		}

		let mock = sinon.mock(hello);
		mock.expects('foo').returns('foo');
		mock.expects('bar').withArgs('hello').returns('hello')

		debug(hello.foo())
		debug(hello.bar('hello'))
	})

	afterEach(() => {
		sinon.restore();
	});
});