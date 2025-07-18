import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 */
export default class AuthMiddleware {
  /**
   * Handle request
   */
  public async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticate()
      await next()
    } catch (error) {
      return ctx.response.status(401).json({
        message: 'Unauthorized access'
      })
    }
  }
}