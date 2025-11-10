import { SendMailClient, SendMailPayload, ZeptoRecipient, EmailAddr } from 'zeptomail'
import env from '#start/env'

type Recipient = { address: string; name?: string }

const client = new SendMailClient({
  url: env.get('ZEPTO_URL'),
  token: env.get('ZEPTO_TOKEN'),
})

function mapRecipients(to: Recipient[]): ZeptoRecipient[] {
  return to.map((r) => ({
    email_address: {
      address: r.address,
      name: r.name ?? '',
    },
  }))
}

type SendArgs = {
  to: Recipient[]
  subject: string
  html: string
  fromAddress?: string
  fromName?: string
}

export async function sendZeptoMail({
  to,
  subject,
  html,
  fromAddress,
  fromName,
}: SendArgs): Promise<unknown> {
  const from: EmailAddr = {
    address: fromAddress || env.get('MAIL_FROM_ADDRESS'),
    name: fromName || env.get('MAIL_FROM_NAME'),
  }

  const payload: SendMailPayload = {
    from,
    to: mapRecipients(to),
    subject,
    htmlbody: html,
  }

  return client.sendMail(payload)
}

export { client as zeptoClient }
