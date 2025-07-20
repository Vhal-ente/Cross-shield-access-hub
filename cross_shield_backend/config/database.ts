import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const databaseConfig = defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | The default connection defined here is used by AdonisJS DataModels and
  | the Query Builder.
  |
  */
  connection: env.get('DB_CONNECTION'),

  /*
  |--------------------------------------------------------------------------
  | MySQL config
  |--------------------------------------------------------------------------
  |
  | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql2
    |
    */
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD', ''),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
      },
    },

    sqlite: {
      client: 'sqlite',
      connection: {
        filename: './tmp/db.sqlite3',
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys=true', cb)
        },
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
    },
  },
})

export default databaseConfig
