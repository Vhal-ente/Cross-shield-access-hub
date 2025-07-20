// import type { HttpContext } from '@adonisjs/core/http'
// import type { NextFn } from '@adonisjs/core/types/http'
// import type { Authenticators } from '@adonisjs/auth/types'

// /**
//  * Auth middleware is used authenticate HTTP requests and deny
//  * access to unauthenticated users.
//  */
// export default class AuthMiddleware {
//   /**
//    * The URL to redirect to, when authentication fails
//    */
//   redirectTo = '/login'

//   async handle(
//     ctx: HttpContext,
//     next: NextFn,
//     options: {
//       guards?: (keyof Authenticators)[]
//     } = {}
//   ) {
//     await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
//     return next()
//   }
// }

import { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 */
export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, {
        loginRoute: this.redirectTo,
      })
      return next()
    } catch {
      // fallback to JSON if request expects JSON
      if (ctx.request.ajax() || ctx.request.accepts(['json'])) {
        return ctx.response.status(401).json({ message: 'Unauthorized access' })
      }

      // fallback to default behavior
      return ctx.response.redirect(this.redirectTo)
    }
  }
}
