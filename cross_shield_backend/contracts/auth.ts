/**
 * Contract source: https://git.io/JOdz5
 *
 * Feel free to let us know via PR, if you find something broken in this
 * file.
 */

// 1. Import all v6 types AND your User model
import type {
  SessionGuardContract,
  SessionGuardConfig,
  AccessTokenGuardContract,
  AccessTokenGuardConfig,
  LucidUserProviderContract,
  LucidUserProviderConfig, // Use the v6 config type
} from '@adonisjs/auth/types'

import type User from '#models/user' // 👈 Import your User model

// 2. Use the v6 module path for the declaration
declare module '@adonisjs/auth/types' {
  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  */
  interface ProvidersList {
    user: {
      // 3. Use v6 type names and the imported User model
      implementation: LucidUserProviderContract<typeof User>
      config: LucidUserProviderConfig<typeof User>
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | Guards are used for authenticating users. The auth module comes with:
  |
  | - SessionGuardContract
  | - AccessTokenGuardContract (Opaque access token)
  |
  */
  interface GuardsList {
    /*
    |--------------------------------------------------------------------------
    | Web Guard
    |--------------------------------------------------------------------------
    */
    web: {
      // 4. Use simplified v6 guard types
      implementation: SessionGuardContract<typeof User>
      config: SessionGuardConfig
    }

    /*
    |--------------------------------------------------------------------------
    | API Guard
    |--------------------------------------------------------------------------
    */
    api: {
      // 5. Use AccessTokenGuardContract (replaces OATGuardContract)
      implementation: AccessTokenGuardContract<typeof User>
      config: AccessTokenGuardConfig
    }
  }
}
