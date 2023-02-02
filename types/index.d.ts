import { Continify } from 'continify'
import * as jwt from 'jsonwebtoken'

export interface ContinifyHTTPJWTOptions {
  secret?: string
  // https://www.npmjs.com/package/jsonwebtoken
  algorithm?: string
  expiresIn?: string | number | undefined
}

export type ContinifyHTTPJWTPlugin = (
  ins: Continify,
  options: ContinifyHTTPJWTOptions
) => Promise<void>

export interface JWT {
  $options: ContinifyHTTPJWTOptions
  sign(
    data: string | Buffer | object,
    options?: ContinifyHTTPJWTOptions
  ): string
  verify(
    token: string,
    options?: ContinifyHTTPJWTOptions
  ): string | Buffer | object
}

declare const plugin: ContinifyHTTPJWTPlugin
export = plugin

declare module 'avvio' {
  interface Use<I, C = context<I>> {
    (fn: ContinifyHTTPJWTPlugin, options?: ContinifyHTTPJWTOptions): C
  }
}

declare module 'continify' {
  interface ContinifyOptions {
    jwt?: ContinifyHTTPJWTOptions
  }

  interface Continify {
    $jwt: JWT
  }
}
