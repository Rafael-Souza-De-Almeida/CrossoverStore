import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import User from '#models/user'
import MakeView from '@adonisjs/core/commands/make/view'
import { Exception } from '@adonisjs/core/exceptions'
import { Redirect, type HttpContext } from '@adonisjs/core/http'
import { messages } from '@vinejs/vine/defaults'

export default class CartsController {
  async show({ auth, response, view }: HttpContext) {
    const user = await auth.authenticate()
    const result = await CartItem.query()
      .join('products', 'cart_items.product_id', 'products.id')
      .select('cart_items.*', 'products.name')
      .where('cart_items.user_id', user.id)

    const totalCart = await CartItem.query()
      .where('userId', user.id)
      .sum('subtotal as total')
      .first()

    if (result.length === 0) {
      return view.render('pages/cart/cart', { message: 'Carrinho vazio' })
    }

    return view.render('pages/cart/cart', { result, totalCart })
  }

  async add({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (!user) {
      throw new Error('Faça Login Para adicionar o produto ao carrinho...')
    }

    const { product_id, quantity } = request.only(['product_id', 'quantity'])

    const product = await Product.query().where('id', product_id).firstOrFail()

    const price = product.price

    const subtotal = price * quantity

    const find_user_or_create = await Cart.firstOrCreate({ userId: user.id })

    const verifyingItem = await CartItem.query()
      .where('userId', user.id)
      .where('productId', product_id)
      .first()

    if (verifyingItem) {
      return response.badRequest({ message: 'Produto já adicionado ao carrinho' })
    }

    const creatingItem = await CartItem.create({
      userId: user.id,
      productId: product_id,
      quantity,
      subtotal,
    })

    return response.json({ message: 'Produto adicionado com sucesso' })
  }

  async delete({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { product_id } = request.only(['product_id'])

    const item = await CartItem.query()
      .where('product_id', product_id)
      .andWhere('user_id', user.id)
      .first()

    if (!item) {
      return response.badRequest({
        message: 'Produto não encontrado no seu carrinho.',
      })
    }

    await item.delete()

    return response.json({
      message: 'Produto removido do carrinho com sucesso!',
    })
  }
}
