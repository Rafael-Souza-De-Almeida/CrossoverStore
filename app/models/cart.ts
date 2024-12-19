import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import CartItem from '#models/cart_item'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @hasMany(() => CartItem)
  declare items: HasMany<typeof CartItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
