import type { Context } from 'hono'
import { getPayload } from './cookies.ts'
import { validate } from '../xlsx/templates.ts'

const attachmentName = 'attachment'

export const upload = async (context: Context) => {
  const payload = await getPayload(context),
    userId = payload['userId'], /* Who */
    body = await context.req.parseBody(),
    attachment = body[attachmentName] /* What */
  if (attachment && attachment instanceof File) {
    console.log(`Uploaded file '${attachment.name}', size ${attachment.size}, by ${userId}`)
    const validation = await validate(attachment)
    if (validation.ok)
      return context.json('Template ok')
    else
      return context.json('Template fail')
  }
  else {
    return context.json('Fail', 400)
  }
}
