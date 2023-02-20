const getValue = require('get-value')
const merge = require('lodash.merge')
const omit = require('lodash.omit')
const jwt = require('jsonwebtoken')
const ContinifyPlugin = require('continify-plugin')

const { kJWTOPtions } = require('./symbols')

const signOptionsSchema = [
  'expiresIn',
  'notBefore',
  'audience',
  'algorithm',
  'header',
  'encoding',
  'issuer',
  'subject',
  'jwtid',
  'noTimestamp',
  'keyid',
  'mutatePayload',
  'allowInsecureKeySizes',
  'allowInvalidAsymmetricKeyTypes'
]

function JWTWrap (options) {
  this[kJWTOPtions] = options
}

Object.defineProperties(JWTWrap.prototype, {
  $options: {
    get () {
      return this[kJWTOPtions]
    }
  }
})

JWTWrap.prototype.sign = function (data, options = {}) {
  const nOption = merge(this.$options, options)
  return jwt.sign(
    data,
    nOption.secret,
    omit(
      nOption,
      Object.keys(nOption).filter(v => !signOptionsSchema.includes(v))
    )
  )
}
JWTWrap.prototype.verify = function (token, options = {}) {
  const nOption = merge(this.$options, options)
  return jwt.verify(token, nOption.secret, nOption)
}

module.exports = ContinifyPlugin(
  async function (ins, options) {
    const { $options } = ins
    const envOption = getValue($options, 'jwt', {
      default: {}
    })
    const jwtOption = merge(options, envOption)

    const jwt = new JWTWrap(jwtOption)
    ins.decorate('$jwt', jwt)
  },
  {
    secret: 'continify-jwt-token',
    algorithm: 'HS256',
    expiresIn: '2h',
    continify: '>=0.1.11'
  }
)
