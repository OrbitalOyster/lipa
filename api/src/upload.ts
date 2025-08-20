import type { Context } from 'hono'

const attachmentName = 'attachment'

export const upload = async (context: Context) => {
  const body = await context.req.parseBody(),
    attachment = body[attachmentName]
  if (attachment) {
    console.log(`Uploaded file '${attachment.name}', size ${attachment.size}`)
    return context.json('Success')
  } else {
    return context.json('Fail', 400)
  }
}
