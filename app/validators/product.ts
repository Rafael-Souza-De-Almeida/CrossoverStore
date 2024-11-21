import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    price: vine.number().min(0),
    description: vine.string().trim(),
    type: vine.string(),
  })
)
