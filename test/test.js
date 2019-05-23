'use strict'

const test = require('ava')
const Fastify = require('fastify')
const request = require('request')
const fastifyPug = require('..')
const fileSystem = require('fs')
const path = require('path')

test.cb('should set render template', t => {
  t.plan(4)
  const fastify = Fastify()

  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {
      test: 'a value'
    }
    reply.render('index.pug', model)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'a value')
      t.end()
    })
  })
})

test.cb('should set render template without locals', t => {
  t.plan(3)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    reply.render('index.pug')
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.end()
    })
  })
})

test.cb('should not override content-type header', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {
      test: 'a value'
    }
    reply.header('content-type', 'text/somethingelse')
    reply.render('index.pug', model)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'text/somethingelse')
      t.end()
    })
  })
})

test.cb('should pass opts to locals', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {
      test: 'a value'
    }
    reply.render('test3.pug', model)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'test/views1')
      t.end()
    })
  })
})

test.cb('should include other file', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1',
    filename: path.join(__dirname, '/views1/test')
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {}
    reply.render('test4.pug', model)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'test/views1')
      t.end()
    })
  })
})

test.cb('should set render template using the cache', t => {
  t.plan(9)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  process.env.NODE_ENV = 'production'
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {
      test: 'a value'
    }
    reply.render('index.pug', model)
  })
  fastify.listen(0, err => {
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'a value')
      fileSystem.writeFile(path.join(__dirname, '/views1/index.pug'), '| another value', (err) => {
        t.falsy(err)
        request({
          method: 'GET',
          uri: 'http://localhost:' + fastify.server.address().port
        }, (err, response, body) => {
          fastify.server.unref()
          t.falsy(err)
          t.is(response.statusCode, 200)
          t.is(body, 'a value')
          fileSystem.writeFile(path.join(__dirname, '/views1/index.pug'), '!=test', (err) => {
            t.falsy(err)
            t.end()
          })
        })
      })
    })
  })
})

test.cb('should set render pug template if no file ending', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    const model = {
      test: 'a value'
    }
    reply.render('index', model)
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'a value')
      t.end()
    })
  })
})

test.cb('should use value from locals', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    reply.locals.test = 'a value'
    reply.render('index.pug', {})
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'a value')
      t.end()
    })
  })
})

test.cb('should use templates from fallback dir', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1',
    fallbackViews: 'test/views2'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    reply.locals.test = 'a value'
    reply.render('test.pug', {})
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.statusCode, 200)
      t.is(body, 'a value')
      t.end()
    })
  })
})

test.cb('should pass error if template not found', t => {
  t.plan(4)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    reply.locals.test = 'a value'
    reply.render('test2.pug', {})
  })
  fastify.setErrorHandler((error, request, reply) => {
    t.truthy(error)
    reply.header('Content-Type', 'text/html')
    reply.send('test')
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(body, 'test')
      t.end()
    })
  })
})

test.cb('should set content type header', t => {
  t.plan(3)
  const fastify = Fastify()
  
  const options = {
    views: 'test/views1',
    fallbackViews: 'test/views2'
  }
  fastify.register(fastifyPug, options)
  fastify.get('/', (request, reply) => {
    reply.locals.test = 'a value'
    reply.render('test.pug', {})
  })
  fastify.listen(0, err => {
    fastify.server.unref()
    t.falsy(err)
    request({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.falsy(err)
      t.is(response.headers['content-type'], 'text/html')
      t.end()
    })
  })
})
