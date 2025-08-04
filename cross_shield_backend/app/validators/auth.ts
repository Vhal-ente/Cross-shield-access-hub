import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    phone: vine.string(),
    password: vine.string().minLength(6),
    role: vine.enum(['health_practitioner', 'supplier', 'diaspora', 'beneficiary']),
    location: vine.string().optional(),
    licenseNumber: vine.string().optional(),
    businessName: vine.string().optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(6),
  })
)
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(6),
    newPassword: vine.string().minLength(6),
  })
)
export const verifyEmailValidator = vine.compile(
  vine.object({
    token: vine.string(),
  })
)
export const resendVerificationEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
