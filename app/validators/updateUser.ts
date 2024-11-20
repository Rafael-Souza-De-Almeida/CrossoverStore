import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().email().trim(),
  })
)
