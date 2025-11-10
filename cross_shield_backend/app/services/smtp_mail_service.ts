import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import {
  userRegistered,
  adminApproved,
  adminSuspended,
  adminRestored,
  adminRejected,
} from '../Mail/email.js'

type BasicUser = { email: string; fullName?: string }

type SendArgs = {
  to: string
  subject: string
  html: string
  text?: string
  fromAddress?: string
  fromName?: string
}

function buildLink(path: string) {
  const base = env.get('FRONTEND_URL', env.get('APP_URL'))
  return new URL(path, base).toString()
}

async function sendEmail(args: SendArgs) {
  const fromAddress = args.fromAddress || env.get('MAIL_FROM_ADDRESS')
  const fromName = args.fromName || env.get('MAIL_FROM_NAME')

  await mail.send((message) => {
    message.from(fromAddress, fromName).to(args.to).subject(args.subject).html(args.html)

    if (args.text) message.text(args.text)
  })
}

export async function sendUserRegisteredEmail(user: BasicUser, verifyUrl?: string) {
  const t = userRegistered({
    userName: user.fullName || 'there',
    appName: 'Cross Shield',
    // verifyUrl,
    supportEmail: 'support@crossshieldhc.com',
  })

  await sendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
}

export async function sendAdminApprovedEmail(user: BasicUser, loginUrl?: string) {
  const url = loginUrl || buildLink('/login')
  const t = adminApproved({
    userName: user.fullName || 'there',
    appName: 'Cross Shield',
    loginUrl: url,
  })

  await sendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
}

export async function sendAdminSuspendedEmail(user: BasicUser, appealUrl?: string) {
  const t = adminSuspended({
    userName: user.fullName || 'there',
    appName: 'Cross Shield',
    contactEmail: 'support@crossshieldhc.com',
    appealUrl,
  })

  await sendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
}

export async function sendAdminRestoredEmail(user: BasicUser, loginUrl?: string) {
  const url = loginUrl || buildLink('/login')
  const t = adminRestored({
    userName: user.fullName || 'there',
    appName: 'Cross Shield',
    loginUrl: url,
  })

  await sendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
}

export async function sendAdminRejectedEmail(
  user: BasicUser,
  contactEmail?: string,
  reapplyUrl?: string
) {
  const t = adminRejected({
    userName: user.fullName || 'there',
    appName: 'Cross Shield',
    contactEmail: contactEmail || 'support@crossshieldhc.com',
    reapplyUrl,
  })

  await sendEmail({ to: user.email, subject: t.subject, html: t.html, text: t.text })
}
