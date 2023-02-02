const tap = require('tap')
const Continify = require('continify')
const ContinifyJWT = require('..')

tap.test('jwt', async t => {
  const ins = Continify()
  ins.register(ContinifyJWT)

  t.plan(1)
  await ins.ready()
  t.ok(ins.hasDecorator('$jwt'))
  await ins.close()
})

tap.test('jwt: $options', async t => {
  const ins = Continify({ jwt: { expiresIn: '5h' } })
  ins.register(ContinifyJWT, { secret: 'test-key' })

  t.plan(2)
  await ins.ready()
  t.equal(ins.$jwt.$options.secret, 'test-key')
  t.equal(ins.$jwt.$options.expiresIn, '5h')
  await ins.close()
})

tap.test('jwt: siign an verify', async t => {
  const ins = Continify({ jwt: { expiresIn: '5h' } })
  ins.register(ContinifyJWT, { secret: 'test-key' })

  t.plan(1)
  await ins.ready()
  const data = {
    id: '123456789'
  }
  const sign = ins.$jwt.sign(data)
  const verify = ins.$jwt.verify(sign)
  t.equal(data.id, verify.id)
  await ins.close()
})
