'use strict';

const t = require('tap');
const test = t.test;
const Fastify = require('fastify');
const request = require('request');
const fastifyPug = require('..');
const fileSystem = require('fs');

test('should set render template', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.render('index.pug', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
		})
	})
})

test('should set render template without locals', t => {
	t.plan(3);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		reply.render('index.pug');
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
		})
	})
})

test('should not override content-type header', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.header('content-type', 'text/somethingelse')
		reply.render('index.pug', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(response.headers['content-type'], 'text/somethingelse');
		})
	})
})

test('should pass opts to locals', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.render('test3.pug', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'test/views1');
		})
	})
})

test('should include other file', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1',
		filename: __dirname + '/views1/test'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {}
		reply.render('test4.pug', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'test/views1');
		})
	})
})

test('should set render template using the cache', t => {
	t.plan(9);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	process.env.NODE_ENV = 'production';
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.render('index.pug', model);
	})
	fastify.listen(0, err => {
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
			fileSystem.writeFile(__dirname + '/views1/index.pug', '| another value', (err) => {
				t.error(err);
				request({
					method: 'GET',
					uri: 'http://localhost:' + fastify.server.address().port
				}, (err, response, body) => {
					fastify.server.unref();
					t.error(err);
					t.strictEqual(response.statusCode, 200);
					t.strictEqual(body, 'a value');
					fileSystem.writeFile(__dirname + '/views1/index.pug', '!=test', (err) => {
						t.error(err);
					});
				});
			});
		})
	})
})

test('should set render pug template if no file ending', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.render('index', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
		})
	})
})

test('should use jade as template engine', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1',
		engine: 'jade'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		const model = {
			test: 'a value'
		}
		reply.render('index.jade', model);
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
		})
	})
})

test('should use value from locals', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1',
		engine: 'jade'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		reply.locals.test = 'a value';
		reply.render('index.jade', {});
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
		})
	})
})

test('should use templates from fallback dir', t => {
	t.plan(4);
	const fastify = Fastify();

	const options = {
		views: 'test/views1',
		fallbackViews: 'test/views2',
		engine: 'pug'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		reply.locals.test = 'a value';
		reply.render('test.pug', {});
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.statusCode, 200);
			t.strictEqual(body, 'a value');
		})
	})
})

test('should pass error if template not found', t => {
	t.plan(3);
	const fastify = Fastify();

	const options = {
		views: 'test/views1'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		reply.locals.test = 'a value';
		reply.render('test2.pug', {});
	});
	fastify.setErrorHandler((error, request, reply) => {
		reply.header('Content-Type', 'text/html');
		reply.send("test");
	});
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(body, "test");
		})
	})
})

test('should set content type header', t => {
	t.plan(3);
	const fastify = Fastify();

	const options = {
		views: 'test/views1',
		fallbackViews: 'test/views2',
		engine: 'pug'
	}
	fastify.register(fastifyPug, options);
	fastify.get('/', (request, reply) => {
		reply.locals.test = 'a value';
		reply.render('test.pug', {});
	})
	fastify.listen(0, err => {
		fastify.server.unref();
		t.error(err);
		request({
			method: 'GET',
			uri: 'http://localhost:' + fastify.server.address().port
		}, (err, response, body) => {
			t.error(err);
			t.strictEqual(response.headers['content-type'], 'text/html');
		})
	})
})

