import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  async index() {
    const allProducts = await Product.all()

    return allProducts
  }

  async findByType({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const payload = request.only(['type'])

    const query = Product.query()

    if (payload.type && payload.type.length > 0) {
      query.where('type', 'like', `%${payload.type}%`)
    }

    const products = await query.paginate(page, limit)

    return products
  }

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

    return response.redirect().toRoute('products.show', { id: product.id })
  }

  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return product
  }

  async delete({ params }: HttpContext) {
    const productIdToDelete = await Product.findOrFail(params.id)

    await productIdToDelete.delete()

    return { sucess: `${params.id} removido` }
  }

  async update({ params, request, response }: HttpContext) {
    const productToUpdate = await Product.findOrFail(params.id)

    const fields = request.only(['name', 'price', 'type', 'description'])
    productToUpdate.merge(fields)

    const imagePost = request.file('image', {
      size: '20mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (imagePost) {
      const uploadPath = 'storage/uploads'
      await imagePost.move(app.makePath(uploadPath), {
        name: `${cuid()}.${imagePost.extname}`,
      })
      productToUpdate.image_path = `${uploadPath}/${imagePost.fileName}`
    }

    await productToUpdate.save()

    return response.ok(productToUpdate)
  }

  async showImage({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      const imagePath = product.image_path

      return response.download(imagePath)
    } catch (error) {
      return response.notFound('Produto não encontrado ou imagem não disponível')
    }
  }
}
