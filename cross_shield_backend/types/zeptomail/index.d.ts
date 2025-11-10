declare module 'zeptomail' {
  export type EmailAddr = { address: string; name?: string }
  export type ZeptoRecipient = { email_address: EmailAddr }
  export type Attachment = { name: string; mime_type: string; content: string }
  export type SendMailPayload = {
    from: EmailAddr
    to: ZeptoRecipient[]
    cc?: ZeptoRecipient[]
    bcc?: ZeptoRecipient[]
    reply_to?: EmailAddr
    subject: string
    htmlbody?: string
    textbody?: string
    attachments?: Attachment[]
  }
  export class SendMailClient {
    constructor(options: { url: string; token: string })
    sendMail(payload: SendMailPayload): Promise<unknown>
  }
}
