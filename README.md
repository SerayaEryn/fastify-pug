# fastify-pug

[![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/fastify-pug.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/SerayaEryn/fastify-pug.svg?branch=master)](https://travis-ci.org/SerayaEryn/fastify-pug)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/fastify-pug/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/fastify-pug?branch=master)
[![NPM version](https://img.shields.io/npm/v/fastify-pug.svg?style=flat)](https://www.npmjs.com/package/fastify-pug)

A plugin for [fastify](http://fastify.io/) that adds support for the template engine [pug](https://pugjs.org).

## Install

```
npm install fastify-pug
```

## Usage

```js
const fastify = require('fastify');
const fastifyPug = require('fastify-pug');

const app = fastify();
app.register(fastifyPug, {views: 'views'});
app.get('/', (request, reply) => {
	reply.render('template.pug');
});
fastify.listen(3000, (error) => {
	if (err) throw err
})
```

## API

### Options
* `views` - the relative path to the folder containing the views.
* `fallbackViews` (optional) - a fallback directory for the views.
* `engine` (optional) - allows to use jade if needed. Defaults to `pug`.
### reply.render(view [, locals])
Renders the template from the relative path `view`. Allows to pass variables to the template via the `locals` object.

## License

[MIT License](./LICENSE)