'use strict';

const fastifyPlugin = require('fastify-plugin');
const extend = require('util-extend');
const { readFile } = require('fs');
const { resolve } = require('path');

function fastifyPug(fastify, opts, next) {
	fastify.decorateReply('locals', {}); 
	fastify.decorateReply('render', render); 

	const cache = {};
	const engine = require(opts.engine || 'pug');
	const templatesDir = resolve(opts.views);
	const fileEnding = '.' + (opts.engine || 'pug');

	let fallbackTempateDir;
	if (opts.fallbackViews) {
		fallbackTempateDir = resolve(opts.fallbackViews);
	}

	function render(view, options) {
		let locals = extend(opts, options || {});
		locals = extend(locals, this.locals);

		if (!view.includes(fileEnding)) {
			view += fileEnding;
		}
		const cachedView = cache[view];

		if (cachedView && process.env.NODE_ENV === 'production') {
			const html = cachedView(locals);
			setContentTypeHeader(this);
			this.send(html);
		} else {
			readFile(`${templatesDir}/${view}`, 'utf8', readFileCallback(this, templatesDir, fallbackTempateDir, view, locals));
		}
	}

	function readFileCallback(that, templatesDir, fallbackTempateDir, view, locals) {
		return function readFileCallbackInternal(error, template) {
			if (error && fallbackTempateDir) {
				readFile(`${fallbackTempateDir}/${view}`, 'utf8', readFileCallback(that, templatesDir, null, view, locals));
				return;
			} else if (error) {
				that.send(error);
				return;
			}
			const compiledTemplate = engine.compile(template, locals);
			cache[view] = compiledTemplate;
			setContentTypeHeader(that);
			that.send(compiledTemplate(locals));
		}
	}
	next();
}

function setContentTypeHeader(that) {
	if (!that.getHeader('content-type')) {
		that.header('Content-Type', 'text/html');
	}
}

exports = module.exports = fastifyPlugin(fastifyPug, '>=0.43.0');
