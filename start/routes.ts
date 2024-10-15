import router from '@adonisjs/core/services/router'
import Product from '#models/product'

const ProductsController = () => import('#controllers/products_controller')

router
  .get('/', async ({ view }) => {
    const products = await Product.all()
    return view.render('pages/home', { products: products })
  })
  .as('products.home')

router
  .get('/show/:id', async ({ params, view }) => {
    const product = await Product.findOrFail(params.id)
    return view.render('pages/product', { product })
  })
  .as('products.show') // Nomeia a rota como 'products.show'

router
  .group(() => {
    // router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.number())
    router.get('/type', [ProductsController, 'findByType'])
    router
      .get('/image/:id', [ProductsController, 'showImage'])
      .where('id', router.matchers.number())
    router.post('/add', [ProductsController, 'create'])
    router.delete('/:id', [ProductsController, 'delete']).where('id', router.matchers.number())
    router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.number())
  })
  .prefix('products')
