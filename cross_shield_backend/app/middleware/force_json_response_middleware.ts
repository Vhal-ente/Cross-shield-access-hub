import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */

// export default class ForceJsonResponseMiddleware {
//   async handle({ request, response }: HttpContext, next: () => Promise<void>) {
//     request.request.headers['accept'] = 'application/json'

//     await next()

//     if (!response.getHeader('content-type')) {
//       response.header('content-type', 'application/json')
//     }
//   }
// }

export default class ForceJsonResponseMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    ctx.response.header('Content-Type', 'application/json')
    await next()
  }
}
