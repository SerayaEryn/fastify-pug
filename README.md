# fastify-pug

![Build Status](https://github.com/SerayaEryn/fastify-pug/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/fastify-pug/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/fastify-pug?branch=master)
[![NPM version](https://img.shields.io/npm/v/fastify-pug.svg?style=flat)](https://www.npmjs.com/package/fastify-pug)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

app.listen(3000, (error) => {
	if (error) throw error
})
```

## API

### Options
* `views` - the relative path to the folder containing the views.
* `fallbackViews` (optional) - a fallback directory for the views.
* `filename` (optional) - for handling relative includes. Pass in a function like (view: string) => `src/${view}`
### reply.render(view [, locals])
Renders the template from the relative path `view`. Allows to pass variables to the template via the `locals` object.

## License

[MIT License](./LICENSE)
