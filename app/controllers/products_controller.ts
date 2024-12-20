import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'
import { createProductValidator } from '#validators/product'
import app from '@adonisjs/core/services/app'
import fs from 'fs'
import path from 'path'
import { Application } from '@adonisjs/core/app'

export default class ProductsController {
  async index({ view }: HttpContext) {
    const allProducts = await Product.query().limit(10)

    return view.render('pages/home', { products: allProducts })
  }

  async findByType({ request, view, params }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    const order = request.input('order', 'asc')

    const payload = params.type

    const query = Product.query()

    if (payload && payload.length > 0) {
      query.where('type', payload)
    }

    if (order === 'desc') {
      query.orderBy('price', 'desc')
    } else {
      query.orderBy('price', 'asc')
    }

    const products = await query.paginate(page, limit)

    return view.render('pages/types/type', { products, payload, order })
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

    const fields = await request.validateUsing(createProductValidator)

    product.merge({
      ...fields,
      image_path: `${uploadPath}/${imagePost.fileName}`,
    })

    await product.save()

    return response.redirect().toRoute('products.show', { id: product.id })
  }

  async show({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return view.render('pages/product', { product })
  }

  public async delete({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      if (product.image_path) {
        const imagePath = product.image_path
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      await product.delete()

      return response
        .status(200)
        .json({ success: `Produto com ID ${params.id} foi removido com sucesso` })
    } catch (error) {
      return response
        .status(500)
        .json({ error: 'Erro ao excluir o produto', details: error.message })
    }
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

  async addForm({ view }: HttpContext) {
    return view.render('pages/add_product')
  }
}
