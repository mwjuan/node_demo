const Router = require('koa-router');
const JSON = require('./fastJson');
const redisService = require('./redis')
const Pinyin = require('./Pinyin')
const shell = require('shelljs');
const cheerio = require('cheerio')
const router = new Router();
const users = [{
	firstName: 'firstName1',
	lastName: 'lastName1',
	age: 16
}, {
	firstName: 'firstName2',
	lastName: 'lastName2',
	age: 18
}, {
	firstName: 'firstName3',
	lastName: 'lastName3',
	age: 19
}];

router.get('/', async ctx => {
	console.log(require("util").inspect(ctx.userAgent));
	ctx.body = 'hi, node test demo';
})

router.get('/user', async ctx => {
	ctx.body = JSON.objectify({
		firstName: 'firstName1',
		lastName: 'lastName1',
		age: 16
	});
})

router.get('/users', async ctx => {
	ctx.body = JSON.arrayify(users);
})

router.get('/view', async ctx => {
	await ctx.render('users', { users });
})

router.get('/user/view', async ctx => {
	const $ = cheerio.load(`<h1>ffff</h1>`);
	$('h1').text('cheerio');
	console.log($.html());
	await ctx.render('user', {
		firstName: 'firstName1',
		lastName: 'lastName1',
		age: 16
	});
})

router.get('/redis', async ctx => {
	await redisService.redis.get("foo").then(function (foo) {
		ctx.body = `redis.get("foo") ==>> ${foo}`;
	});
})

router.get('/py', async ctx => {
	let p = new Pinyin();
	let a = p.getPY('拼音');
	let b = p.getDPY('中');
	// let c = p.getDFPY('拼音');
	let e = p.getFGPY('拼音');
	let f = p.compare('拼音');

	ctx.body = `获取分词拼音:${a}  	获取多音字:${b}    设置拼音风格：${e}     排序：${f}`
})

router.get('/shell', async ctx => {
	shell.cp('-R', 'config/', 'config1');
	ctx.body = 'ok';
})

module.exports = router;