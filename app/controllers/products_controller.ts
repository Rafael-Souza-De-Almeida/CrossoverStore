import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  async create({ request, response }: HttpContext) {
    const imagePost = request.file('image', {
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!imagePost) {
      return response.badRequest('Não foi possivel encontrar a imagem')
    }
    const uploadPath = 'storage/uploads'
    await imagePost.move(app.makePath(uploadPath), {
      name: `${cuid()}.${imagePost.extname}`,
    })

    const product = new Product()

    const fields = request.only(['name', 'price', 'type', 'description'])

    product.merge({
      ...fields,
      image_path: `${uploadPath}/${imagePost.fileName}`,
    })

    await product.save()

    return response.created(product)
  }
}
