const tap = require('tap')
const Continify = require('continify')
const ContinifyHTTP = require('continify-http')
const ContinifyJWT = require('..')

tap.test('jwt: pass', async t => {
  const ins = Continify()
  ins.register(ContinifyHTTP, { port: 3000 })
  ins.register(ContinifyJWT)

  t.plan(3)
  ins.register(async i1 => {
    i1.addHook('onRequest', async function (req, rep) {
      const headers = req.$headers
      req.$user = this.$jwt.verify(headers.token)
    })

    i1.route({
      url: '/jwt/pass',
      handler (req, rep) {
        t.equal(req.$user.id, '123465')
        rep.send('jwt-pass')
      }
    })
  })

  await ins.ready()
  const sign = ins.$jwt.sign({ id: '123465' })
  const { statusCode, payload } = await ins.inject({
    url: '/jwt/pass',
    headers: {
      token: sign
    }
  })
  t.equal(statusCode, 200)
  t.equal(payload, 'jwt-pass')

  await ins.close()
})

tap.test('jwt: verify error', async t => {
  const ins = Continify()
  ins.register(ContinifyHTTP, { port: 3001 })
  ins.register(ContinifyJWT)

  t.plan(2)
  ins.register(async i1 => {
    i1.addHook('onRequest', async function (req, rep) {
      const headers = req.$headers
      req.$user = this.$jwt.verify(headers.token)
    })

    i1.route({
      url: '/jwt/pass',
      handler (req, rep) {
        t.fail('assert')
      }
    })
  })

  await ins.ready()
  const { statusCode, payload } = await ins.inject({
    url: '/jwt/pass',
    headers: {
      token: 'error'
    }
  })
  t.equal(statusCode, 400)
  t.equal(payload, 'jwt malformed')

  await ins.close()
})
