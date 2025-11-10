export type TemplateResult = {
  subject: string
  html: string
  text: string
}

export type Recipient = {
  address: string
  name?: string
}

const BRAND_BG = '#0b63ce'
const TEXT_COLOR = '#0b1220'
const MUTED_COLOR = '#5b667a'
const BORDER_COLOR = '#e6ebf1'

function esc(input: string | undefined | null): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function button(url: string, label: string): string {
  if (!url) return ''
  return `
      <a href="${esc(url)}" style="
        display:inline-block;
        padding:12px 18px;
        background:${BRAND_BG};
        color:#ffffff;
        text-decoration:none;
        border-radius:8px;
        font-weight:600;
        font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;
      ">
        ${esc(label)}
      </a>
    `
}

function layout(opts: { title: string; body: string; footer?: string }): string {
  const { title, body, footer } = opts
  return `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${esc(title)}</title>
    </head>
    <body style="margin:0;background:#f6f8fb;color:${TEXT_COLOR};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${BORDER_COLOR};border-radius:12px;overflow:hidden">
              <tr>
                <td style="background:${BRAND_BG};padding:16px 20px;color:#ffffff;font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;font-size:18px;font-weight:700">${esc(title)}</td>
              </tr>
              <tr>
                <td style="padding:20px 24px;font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;line-height:1.55;color:${TEXT_COLOR}">
                  ${body}
                </td>
              </tr>
              ${footer ? `<tr><td style="padding:12px 24px;border-top:1px solid ${BORDER_COLOR};font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED_COLOR}">${footer}</td></tr>` : ''}
            </table>
            <div style="padding:12px 0;font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED_COLOR}">
              This is an automated message. Do not reply
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
}

function asText(lines: string[]): string {
  return lines.filter(Boolean).join('\n')
}

export function userRegistered(opts: {
  userName: string
  appName?: string
  verifyUrl?: string
  supportEmail?: string
}): TemplateResult {
  const app = opts.appName || 'Cross Shield'
  const title = `${app} registration`
  const lines = [
    `Hi ${opts.userName},`,
    `Welcome to ${app}.`,
    opts.verifyUrl ? 'Confirm your email with the button below.' : 'Your account is ready.',
  ]
  const body = `
      <p>${esc(lines[0])}</p>
      <p>${esc(lines[1])}</p>
      <p>${esc(lines[2])}</p>
      ${opts.verifyUrl ? `<p>${button(opts.verifyUrl, 'Confirm email')}</p>` : ''}
    `
  const footer = opts.supportEmail ? `Need help Email ${esc(opts.supportEmail)}` : ''
  return {
    subject: `${app} account created`,
    html: layout({ title, body, footer }),
    text: asText([
      `${app} registration`,
      lines[0],
      lines[1],
      lines[2],
      opts.verifyUrl ? `Confirm: ${opts.verifyUrl}` : '',
      footer,
    ]),
  }
}

export function adminApproved(opts: {
  userName: string
  appName?: string
  loginUrl?: string
}): TemplateResult {
  const app = opts.appName || 'Cross Shield'
  const title = `${app} approval`
  const lines = [
    `Hi ${opts.userName},`,
    'An admin approved your account.',
    'You now have full access.',
  ]
  const body = `
      <p>${esc(lines[0])}</p>
      <p>${esc(lines[1])}</p>
      <p>${esc(lines[2])}</p>
      ${opts.loginUrl ? `<p>${button(opts.loginUrl, 'Sign in')}</p>` : ''}
    `
  return {
    subject: `${app} account approved`,
    html: layout({ title, body }),
    text: asText([`${app} approval`, ...lines, opts.loginUrl ? `Sign in: ${opts.loginUrl}` : '']),
  }
}

export function adminSuspended(opts: {
  userName: string
  appName?: string
  reason?: string
  contactEmail?: string
  appealUrl?: string
}): TemplateResult {
  const app = opts.appName || 'Cross Shield'
  const title = `${app} suspension notice`
  const reason = opts.reason ? `Reason ${opts.reason}` : 'Reason not specified'
  const lines = [
    `Hi ${opts.userName},`,
    'Your account is suspended.',
    reason,
    opts.contactEmail ? `For support, write ${opts.contactEmail}` : '',
  ]
  const body = `
      <p>${esc(lines[0])}</p>
      <p style="color:#b00020;font-weight:600">${esc(lines[1])}</p>
      <p>${esc(lines[2])}</p>
      ${opts.appealUrl ? `<p>${button(opts.appealUrl, 'Appeal suspension')}</p>` : ''}
      ${opts.contactEmail ? `<p>Contact ${esc(opts.contactEmail)}</p>` : ''}
    `
  return {
    subject: `${app} account suspended`,
    html: layout({ title, body }),
    text: asText([
      `${app} suspension notice`,
      ...lines,
      opts.appealUrl ? `Appeal ${opts.appealUrl}` : '',
    ]),
  }
}

export function adminRestored(opts: {
  userName: string
  appName?: string
  loginUrl?: string
}): TemplateResult {
  const app = opts.appName || 'Cross Shield'
  const title = `${app} account restored`
  const lines = [`Hi ${opts.userName},`, 'We restored your account.', 'You have access again.']
  const body = `
      <p>${esc(lines[0])}</p>
      <p>${esc(lines[1])}</p>
      <p>${esc(lines[2])}</p>
      ${opts.loginUrl ? `<p>${button(opts.loginUrl, 'Open dashboard')}</p>` : ''}
    `
  return {
    subject: `${app} account restored`,
    html: layout({ title, body }),
    text: asText([
      `${app} account restored`,
      ...lines,
      opts.loginUrl ? `Dashboard ${opts.loginUrl}` : '',
    ]),
  }
}

export function adminRejected(opts: {
  userName: string
  appName?: string
  reason?: string
  contactEmail?: string
  reapplyUrl?: string
}): TemplateResult {
  const app = opts.appName || 'Cross Shield'
  const title = `${app} application update`
  const reason = opts.reason ? `Reason ${opts.reason}` : 'Reason not specified'
  const lines = [
    `Hi ${opts.userName},`,
    'Your application was not approved.',
    reason,
    opts.contactEmail ? `For questions, write ${opts.contactEmail}` : '',
  ]
  const body = `
      <p>${esc(lines[0])}</p>
      <p style="font-weight:600">${esc(lines[1])}</p>
      <p>${esc(lines[2])}</p>
      ${opts.reapplyUrl ? `<p>${button(opts.reapplyUrl, 'Reapply')}</p>` : ''}
      ${opts.contactEmail ? `<p>Contact ${esc(opts.contactEmail)}</p>` : ''}
    `
  return {
    subject: `${app} application rejected`,
    html: layout({ title, body }),
    text: asText([
      `${app} application update`,
      ...lines,
      opts.reapplyUrl ? `Reapply ${opts.reapplyUrl}` : '',
    ]),
  }
}

export default {
  userRegistered,
  adminApproved,
  adminSuspended,
  adminRestored,
  adminRejected,
}
