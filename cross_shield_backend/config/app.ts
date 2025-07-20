import proxyAddr from 'proxy-addr'
import env from '#start/env'
import { defineConfig } from '@adonisjs/core/http'
import { defineConfig as defineLoggerConfig } from '@adonisjs/core/logger'

/*
|--------------------------------------------------------------------------
| Application secret key
|--------------------------------------------------------------------------
|
| The secret to encrypt and sign different values in your application.
| Make sure to keep the `APP_KEY` as an environment variable and secure.
|
| Note: Changing the application key for an existing app will make all
| the cookies invalid and also the existing encrypted data will not
| be decrypted.
|
*/
export const appKey: string = env.get('APP_KEY')

/*
|--------------------------------------------------------------------------
| Http server configuration
|--------------------------------------------------------------------------
|
| The configuration for the HTTP(s) server. Make sure to go through all
| the config options to make keep server secure.
|
*/
export const http = defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Allow method spoofing
  |--------------------------------------------------------------------------
  |
  | Method spoofing enables defining custom HTTP verbs with a `_method` query
  | string. This is usually required when you are making traditional form
  | requests and wants to use HTTP verbs like `PUT`, `DELETE` and so on.
  |
  */
  allowMethodSpoofing: false,

  /*
  |--------------------------------------------------------------------------
  | Sub domain offset
  |--------------------------------------------------------------------------
  |
  | The offset to be used for reading the subdomain from the request hostname.
  | Change this value only when you know what you are doing.
  |
  */
  subdomainOffset: 2,

  /*
  |--------------------------------------------------------------------------
  | Request Ids
  |--------------------------------------------------------------------------
  |
  | Setting this value to `true` will generate a unique request id for each
  | HTTP request and set it as `x-request-id` header.
  |
  */
  generateRequestId: false,

  /*
  |--------------------------------------------------------------------------
  | Trusting proxy servers
  |--------------------------------------------------------------------------
  |
  | Define the proxy servers that AdonisJs must trust for reading `X-Forwarded`
  | headers.
  |
  */
  trustProxy: proxyAddr.compile('loopback'),

  /*
  |--------------------------------------------------------------------------
  | Generating Etag
  |--------------------------------------------------------------------------
  |
  | Whether or not to generate an etag for every response.
  |
  */
  etag: false,

  /*
  |--------------------------------------------------------------------------
  | JSONP Callback
  |--------------------------------------------------------------------------
  |
  | Define the query string name for the JSONP callback. Make sure to set it
  | to `undefined` when not using JSONP.
  |
  */
  jsonpCallbackName: undefined,

  /*
  |--------------------------------------------------------------------------
  | Cookie settings
  |--------------------------------------------------------------------------
  |
  | The cookie settings are used to setup the session id cookie and also the
  | driver will use the same values.
  |
  */
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  },
})

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
|
| Application logger configuration to configure the default log level and
| the logger drivers you want to use for logging messages.
|
*/
export const logger = defineLoggerConfig({
  /*
  |--------------------------------------------------------------------------
  | Default Log Level
  |--------------------------------------------------------------------------
  |
  | Log level is a numeric priority for log messages. Application will log
  | all messages upto the defined priority.
  |
  | Following order of priorities are supported.
  | - fatal:   0
  | - error:   1
  | - warn:    2
  | - info:    3
  | - debug:   4
  | - trace:   5
  |
  */

  /*
  |--------------------------------------------------------------------------
  | Pretty print
  |--------------------------------------------------------------------------
  |
  | It is highly advised NOT to use `prettyPrint` in production, since it
  | can have huge impact on performance.
  |
  */

  /*
  |--------------------------------------------------------------------------
  | Default driver
  |--------------------------------------------------------------------------
  |
  | The default driver to use for logging messages.
  |
  */
  default: 'app',

  /*
  |--------------------------------------------------------------------------
  | Loggers
  |--------------------------------------------------------------------------
  |
  | The loggers object can be used to define multiple loggers.
  | See docs for more details
  |
  */
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info'),
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'info',
            options: {
              colorize: true,
            },
          },
        ],
      },
    },
  },
})

/*
|--------------------------------------------------------------------------
| Profiler
|--------------------------------------------------------------------------
|
| Profiler configuration. Enable it during development to debug performance
| issues.
|
*/
export const profiler = {
  /*
  |--------------------------------------------------------------------------
  | Enable/disable profiler
  |--------------------------------------------------------------------------
  |
  | Enable this during development to profile HTTP requests. You can always
  | turn it off in production.
  |
  */
  enabled: true,

  /*
  |--------------------------------------------------------------------------
  | Blacklisted events
  |--------------------------------------------------------------------------
  |
  | An array of events to not profile. The profiler will ignore these events
  | all together.
  |
  */
  blacklist: [],

  /*
  |--------------------------------------------------------------------------
  | Whitelisted events
  |--------------------------------------------------------------------------
  |
  | An array of events to profile. If whitelist is defined, then profiler
  | will only profile whitelisted events, otherwise all events are profiled.
  |
  */
  whitelist: [],
}

/*
|--------------------------------------------------------------------------
| Validator
|--------------------------------------------------------------------------
|
| Validator configuration. Here you define the global configuration for the
| validator and also define rules that can be used to validate the request
| body against certain schema.
|
*/
export const validator = {}
