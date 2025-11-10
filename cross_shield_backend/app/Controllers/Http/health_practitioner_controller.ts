// // app/controllers/health_practitioners_controller.ts
// import type { HttpContext } from '@adonisjs/core/http'
// import HealthPractitioner from '#models/health_practitioner'
// import User from '#models/user'
// import Role from '#models/role'
// import {
//   createHealthPractitionerValidator,
//   updateHealthPractitionerValidator,
// } from '#validators/health_practitioner'
// import PractitionerResponse from '#models/practitioner_response'
// import PractitionerResponseLine from '#models/practitioner_response_line'
// import db from '@adonisjs/lucid/services/db'
// import { rules, schema } from '@adonisjs/validator'

// export default class HealthPractitionersController {
//   async index({ request, response }: HttpContext) {
//     try {
//       const status = request.input('status')
//       const q = request.input('q')

//       const practitioners = await HealthPractitioner.query()
//         .if(!!status, (b) => b.where('status', status))
//         .if(!!q, (b) =>
//           b.whereHas('user', (u) =>
//             u.whereILike('full_name', `%${q}%`).orWhereILike('email', `%${q}%`)
//           )
//         )
//         .preload('user')
//         .orderBy('created_at', 'desc')

//       const users = practitioners.map((p) => ({
//         id: p.user.id,
//         fullName: p.user.fullName,
//         email: p.user.email,
//         phone: p.user.phone,
//         location: p.location ?? p.user.location,
//         specialization: p.specialization,
//         licenseNumber: p.licenseNumber,
//         status: p.status,
//         createdAt: p.user.createdAt?.toISO(),
//       }))

//       return response.ok({ users })
//     } catch (error) {
//       return response.status(500).json({
//         message: 'Failed to fetch health practitioners',
//         error: error.message,
//       })
//     }
//   }

//   async show({ params, response }: HttpContext) {
//     try {
//       const practitioner = await HealthPractitioner.query()
//         .where('id', params.id)
//         .preload('user')
//         .firstOrFail()

//       return response.ok(practitioner)
//     } catch {
//       return response.status(404).json({ message: 'Health practitioner not found' })
//     }
//   }

//   // POST /health-practitioners
//   async store({ request, response }: HttpContext) {
//     // Validate request body
//     const data = await request.validateUsing(createHealthPractitionerValidator)
//     // unique checks
//     if (await User.query().where('email', data.email).first()) {
//       return response.badRequest({ message: 'Email already exists' })
//     }
//     if (data.licenseNumber) {
//       const exists = await HealthPractitioner.query()
//         .where('license_number', data.licenseNumber)
//         .first()
//       if (exists) return response.badRequest({ message: 'License number already exists' })
//     }
//     try {
//       const body = request.only([
//         'fullName',
//         'email',
//         'phone',
//         'location',
//         'specialization',
//         'licenseNumber',
//         'licenseIssuer',
//         'licenseExpiry',
//         'payload',
//         'status',
//       ])

//       if (!body.fullName || !body.email) {
//         return response.badRequest({ message: 'fullName and email are required' })
//       }

//       const hpRole = await Role.findByOrFail('name', 'health_practitioner')

//       const user = await User.create({
//         fullName: body.fullName,
//         email: body.email,
//         phone: body.phone ?? null,
//         location: body.location ?? null,
//         roleId: hpRole.id,
//       })

//       const practitioner = await HealthPractitioner.create({
//         userId: user.id,
//         specialization: body.specialization ?? null,
//         licenseNumber: body.licenseNumber ?? null,
//         location: body.location ?? null,
//         payload: body.payload ?? null,
//         status: (body.status as 'active' | 'pending' | 'suspended') ?? 'active',
//       })

//       await practitioner.load('user')

//       return response.created({
//         message: 'Health practitioner created',
//         practitioner,
//       })
//     } catch (error) {
//       return response.badRequest({
//         message: 'Failed to create health practitioner',
//         error: error.messages || error.message,
//       })
//     }
//   }

//   // PATCH /health-practitioners/:id
//   async update({ params, request, response }: HttpContext) {
//     try {
//       const practitioner = await HealthPractitioner.findOrFail(params.id)
//       await practitioner.load('user')

//       const data = await request.validateUsing(updateHealthPractitionerValidator)

//       // unique checks excluding current records
//       if (data.email) {
//         const emailTaken = await User.query()
//           .where('email', data.email)
//           .whereNot('id', practitioner.userId)
//           .first()
//         if (emailTaken) return response.badRequest({ message: 'Email already exists' })
//       }

//       if (data.licenseNumber) {
//         const licenseTaken = await HealthPractitioner.query()
//           .where('license_number', data.licenseNumber)
//           .whereNot('id', practitioner.id)
//           .first()
//         if (licenseTaken) return response.badRequest({ message: 'License number already exists' })
//       }

//       const user = practitioner.user
//       if (!user) return response.status(422).json({ message: 'Linked user missing' })

//       // update linked user fields
//       if (data.fullName !== undefined) user.fullName = data.fullName
//       if (data.email !== undefined) user.email = data.email
//       if (data.phone !== undefined) user.phone = data.phone
//       if (data.location !== undefined) user.location = data.location
//       await user.save()

//       // update practitioner profile
//       if (data.specialization !== undefined) practitioner.specialization = data.specialization
//       if (data.licenseNumber !== undefined) practitioner.licenseNumber = data.licenseNumber
//       if (data.location !== undefined) practitioner.location = data.location
//       if (data.payload !== undefined) practitioner.payload = data.payload
//       if (data.status !== undefined) {
//         practitioner.status = data.status as 'active' | 'pending' | 'suspended'
//       }

//       await practitioner.save()
//       await practitioner.load('user')

//       return response.ok(practitioner)
//     } catch (error) {
//       return response.status(400).json({
//         message: 'Failed to update health practitioner',
//         error: error.message,
//       })
//     }
//   }

//   // DELETE /health-practitioners/:id
//   async destroy({ params, response }: HttpContext) {
//     try {
//       const practitioner = await HealthPractitioner.findOrFail(params.id)
//       const user = await User.findOrFail(practitioner.userId)

//       await user.delete()
//       return response.ok({ message: 'Health practitioner deleted' })
//     } catch (error) {
//       return response.status(400).json({
//         message: 'Failed to delete health practitioner',
//         error: error.message,
//       })
//     }
//   }

//   // POST /health-practitioners/:id/respond
//   public async respond({ params, request, response, auth }: HttpContext) {
//     // 1. basic auth/practitioner check
//     const authUser = auth.user
//     if (!authUser) {
//       return response.unauthorized({ message: 'Authentication required' })
//     }

//     // find the HealthPractitioner record that belongs to the current user
//     let practitioner: HealthPractitioner | null = null
//     try {
//       practitioner = await HealthPractitioner.query().where('user_id', authUser.id).firstOrFail()
//     } catch {
//       return response.forbidden({ message: 'You are not registered as a health practitioner' })
//     }

//     // ensure the route param matches the authenticated practitioner's id
//     const routePractitionerId = Number(params.id)
//     if (Number(practitioner.id) !== routePractitionerId) {
//       return response.forbidden({ message: 'Practitioner id mismatch' })
//     }

//     // 2. validate payload
//     const payloadSchema = schema.create({
//       requestId: schema.string({}, [rules.trim()]),
//       providerId: schema.string.optional({}, [rules.trim()]),
//       lines: schema.array.optional().members(
//         schema.object().members({
//           medId: schema.string({}, [rules.trim()]),
//           brand: schema.string.optional({}, [rules.trim()]),
//           price: schema.string.optional({}, [rules.trim()]),
//           availableQty: schema.number.optional(),
//           availability: schema.string.optional({}, [rules.in(['stocked', 'unavailable'])]),
//         })
//       ),
//     })

//     let payload: any
//     try {
//       payload = await request.validate({ schema: payloadSchema })
//     } catch (err) {
//       return response.badRequest({ message: 'Invalid payload', errors: err.messages ?? err })
//     }

//     const { requestId, providerId = null, lines = [] } = payload

//     // 3. server-side duplicate check (single response per request)
//     const existing = await PractitionerResponse.query().where('request_id', requestId).first()
//     if (existing) {
//       return response.conflict({ message: 'Request already responded to' })
//     }

//     // 4. create response inside a transaction (create response + optional detail rows)
//     try {
//       await db.transaction(async (trx) => {
//         const pr = await PractitionerResponse.transaction(trx).create({
//           practitionerId: practitioner.id,
//           requestId,
//           providerId,
//           // keep a raw JSON column for quick lookup / audit; adjust column name if different
//           lines: lines.length ? JSON.stringify(lines) : null,
//         })

//         if (Array.isArray(lines) && lines.length > 0) {
//           for (const ln of lines) {
//             await PractitionerResponseLine.transaction(trx).create({
//               responseId: pr.id,
//               medId: ln.medId,
//               brand: ln.brand ?? null,
//               price: ln.price ?? null,
//               availableQty: ln.availableQty ?? null,
//               availability: ln.availability ?? 'unavailable',
//             })
//           }
//         }
//       })

//       return response.created({ message: 'Response recorded' })
//     } catch (err) {
//       console.error('Failed to save practitioner response', err)
//       return response.internalServerError({
//         message: 'Failed to record response',
//         error: err.message ?? err,
//       })
//     }
//   }

//   // Additional methods like approve/suspend can be added here
//   // async approve({ params, response }: HttpContext) {
//   //   try {
//   //     const practitioner = await HealthPractitioner.findOrFail(params.id)
//   //     practitioner.status = 'active'
//   //     await practitioner.save()
//   //     await practitioner.load('user')

//   //     return response.ok({ message: 'Health practitioner approved', practitioner })
//   //   } catch {
//   //     return response.status(404).json({ message: 'Health practitioner not found' })
//   //   }
//   // }
//   // async suspend({ params, response }: HttpContext) {
//   //   try {
//   //     const practitioner = await HealthPractitioner.findOrFail(params.id)
//   //     practitioner.status = 'suspended'
//   //     await practitioner.save()
//   //     await practitioner.load('user')

//   //     return response.ok({ message: 'Health practitioner suspended', practitioner })
//   //   } catch {
//   //     return response.status(404).json({ message: 'Health practitioner not found' })
//   //   }
//   // }
// }

// app/controllers/health_practitioners_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import HealthPractitioner from '#models/health_practitioner'
import User from '#models/user'
import Role from '#models/role'
import {
  createHealthPractitionerValidator,
  updateHealthPractitionerValidator,
} from '#validators/health_practitioner'
import PractitionerResponse from '#models/practitioner_response'
import PractitionerResponseLine from '#models/practitioner_response_line'
import db from '@adonisjs/lucid/services/db'
import { rules, schema } from '@adonisjs/validator'

export default class HealthPractitionersController {
  async index({ request, response }: HttpContext) {
    try {
      const status = request.input('status')
      const q = request.input('q')

      const practitioners = await HealthPractitioner.query()
        .if(!!status, (b) => b.where('status', status))
        .if(!!q, (b) =>
          b.whereHas('user', (u) =>
            u.whereILike('full_name', `%${q}%`).orWhereILike('email', `%${q}%`)
          )
        )
        .preload('user')
        .orderBy('created_at', 'desc')

      const users = practitioners.map((p) => ({
        id: p.user.id,
        fullName: p.user.fullName,
        email: p.user.email,
        phone: p.user.phone,
        location: p.location ?? p.user.location,
        specialization: p.specialization,
        licenseNumber: p.licenseNumber,
        status: p.status,
        createdAt: p.user.createdAt?.toISO(),
      }))

      return response.ok({ users })
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to fetch health practitioners',
        error: (error as Error).message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const practitioner = await HealthPractitioner.query()
        .where('id', params.id)
        .preload('user')
        .firstOrFail()

      return response.ok(practitioner)
    } catch {
      return response.status(404).json({ message: 'Health practitioner not found' })
    }
  }

  // POST /health-practitioners
  async store({ request, response }: HttpContext) {
    // Validate request body
    const data = await request.validateUsing(createHealthPractitionerValidator)
    // unique checks
    if (await User.query().where('email', data.email).first()) {
      return response.badRequest({ message: 'Email already exists' })
    }
    if (data.licenseNumber) {
      const exists = await HealthPractitioner.query()
        .where('license_number', data.licenseNumber)
        .first()
      if (exists) return response.badRequest({ message: 'License number already exists' })
    }
    try {
      const body = request.only([
        'fullName',
        'email',
        'phone',
        'location',
        'specialization',
        'licenseNumber',
        'licenseIssuer',
        'licenseExpiry',
        'payload',
        'status',
      ])

      if (!body.fullName || !body.email) {
        return response.badRequest({ message: 'fullName and email are required' })
      }

      const hpRole = await Role.findByOrFail('name', 'health_practitioner')

      const user = await User.create({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? null,
        location: body.location ?? null,
        roleId: hpRole.id,
      })

      const practitioner = await HealthPractitioner.create({
        userId: user.id,
        specialization: body.specialization ?? null,
        licenseNumber: body.licenseNumber ?? null,
        location: body.location ?? null,
        payload: body.payload ?? null,
        status: (body.status as 'active' | 'pending' | 'suspended') ?? 'active',
      })

      await practitioner.load('user')

      return response.created({
        message: 'Health practitioner created',
        practitioner,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create health practitioner',
        error: (error as any).messages ?? (error as Error).message,
      })
    }
  }

  // PATCH /health-practitioners/:id
  async update({ params, request, response }: HttpContext) {
    try {
      const practitioner = await HealthPractitioner.findOrFail(params.id)
      await practitioner.load('user')

      const data = await request.validateUsing(updateHealthPractitionerValidator)

      // unique checks excluding current records
      if (data.email) {
        const emailTaken = await User.query()
          .where('email', data.email)
          .whereNot('id', practitioner.userId)
          .first()
        if (emailTaken) return response.badRequest({ message: 'Email already exists' })
      }

      if (data.licenseNumber) {
        const licenseTaken = await HealthPractitioner.query()
          .where('license_number', data.licenseNumber)
          .whereNot('id', practitioner.id)
          .first()
        if (licenseTaken) return response.badRequest({ message: 'License number already exists' })
      }

      const user = practitioner.user
      if (!user) return response.status(422).json({ message: 'Linked user missing' })

      // update linked user fields
      if (data.fullName !== undefined) user.fullName = data.fullName
      if (data.email !== undefined) user.email = data.email
      if (data.phone !== undefined) user.phone = data.phone
      if (data.location !== undefined) user.location = data.location
      await user.save()

      // update practitioner profile
      if (data.specialization !== undefined) practitioner.specialization = data.specialization
      if (data.licenseNumber !== undefined) practitioner.licenseNumber = data.licenseNumber
      if (data.location !== undefined) practitioner.location = data.location
      if (data.payload !== undefined) practitioner.payload = data.payload
      if (data.status !== undefined) {
        practitioner.status = data.status as 'active' | 'pending' | 'suspended'
      }

      await practitioner.save()
      await practitioner.load('user')

      return response.ok(practitioner)
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update health practitioner',
        error: (error as Error).message,
      })
    }
  }

  // DELETE /health-practitioners/:id
  async destroy({ params, response }: HttpContext) {
    try {
      const practitioner = await HealthPractitioner.findOrFail(params.id)
      const user = await User.findOrFail(practitioner.userId)

      await user.delete()
      return response.ok({ message: 'Health practitioner deleted' })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to delete health practitioner',
        error: (error as Error).message,
      })
    }
  }

  // POST /health-practitioners/:id/respond
  public async respond({ params, request, response, auth }: HttpContext) {
    // 1. basic auth/practitioner check
    const authUser = auth.user
    if (!authUser) {
      return response.unauthorized({ message: 'Authentication required' })
    }

    // find the HealthPractitioner record that belongs to the current user
    let practitioner: HealthPractitioner | null = null
    try {
      practitioner = await HealthPractitioner.query().where('user_id', authUser.id).firstOrFail()
    } catch {
      return response.forbidden({ message: 'You are not registered as a health practitioner' })
    }

    // ensure the route param matches the authenticated practitioner's id
    const routePractitionerId = Number(params.id)
    if (Number(practitioner.id) !== routePractitionerId) {
      return response.forbidden({ message: 'Practitioner id mismatch' })
    }

    // 2. validate payload
    const payloadSchema = schema.create({
      requestId: schema.string({}, [rules.trim()]),
      providerId: schema.string.optional({}, [rules.trim()]),
      lines: schema.array.optional().members(
        schema.object().members({
          medId: schema.string({}, [rules.trim()]),
          brand: schema.string.optional({}, [rules.trim()]),
          price: schema.string.optional({}, [rules.trim()]),
          availableQty: schema.number.optional(),
          availability: schema.enum.optional(['stocked', 'unavailable'] as const),
        })
      ),
    })

    let payload: any
    try {
      payload = await request.validate({ schema: payloadSchema })
    } catch (err) {
      return response.badRequest({
        message: 'Invalid payload',
        errors: (err as any).messages ?? err,
      })
    }

    const { requestId, providerId = null, lines = [] } = payload

    // 3. server-side duplicate check (single response per request)
    const existing = await PractitionerResponse.query().where('request_id', requestId).first()
    if (existing) {
      return response.conflict({ message: 'Request already responded to' })
    }

    // 4. create response inside a transaction (create response + optional detail rows)
    try {
      await db.transaction(async (trx) => {
        const pr = await PractitionerResponse.create(
          {
            practitionerId: practitioner.id,
            requestId,
            providerId,
            // keep a raw JSON column for quick lookup / audit; adjust column name if different
            lines: lines.length ? JSON.stringify(lines) : null,
          },
          { client: trx }
        )

        if (Array.isArray(lines) && lines.length > 0) {
          for (const ln of lines) {
            await PractitionerResponseLine.create(
              {
                responseId: pr.id,
                medId: ln.medId,
                brand: ln.brand ?? null,
                price: ln.price ?? null,
                availableQty: ln.availableQty ?? null,
                availability: ln.availability ?? 'unavailable',
              },
              { client: trx }
            )
          }
        }
      })

      return response.created({ message: 'Response recorded' })
    } catch (err) {
      console.error('Failed to save practitioner response', err)
      return response.internalServerError({
        message: 'Failed to record response',
        error: (err as any).message ?? err,
      })
    }
  }

  // Additional methods like approve/suspend can be added here
  // async approve({ params, response }: HttpContext) {
  //   try {
  //     const practitioner = await HealthPractitioner.findOrFail(params.id)
  //     practitioner.status = 'active'
  //     await practitioner.save()
  //     await practitioner.load('user')

  //     return response.ok({ message: 'Health practitioner approved', practitioner })
  //   } catch {
  //     return response.status(404).json({ message: 'Health practitioner not found' })
  //   }
  // }
  // async suspend({ params, response }: HttpContext) {
  //   try {
  //     const practitioner = await HealthPractitioner.findOrFail(params.id)
  //     practitioner.status = 'suspended'
  //     await practitioner.save()
  //     await practitioner.load('user')

  //     return response.ok({ message: 'Health practitioner suspended', practitioner })
  //   } catch {
  //     return response.status(404).json({ message: 'Health practitioner not found' })
  //   }
  // }
}
