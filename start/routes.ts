import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')

router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
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
