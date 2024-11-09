import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')

router.get('/', [ProductsController, 'index']).as('products.home')

router
  .group(() => {
    router
      .get('/:id', [ProductsController, 'show'])
      .where('id', router.matchers.number())
      .as('products.show')

    router.get('/type', [ProductsController, 'findByType'])
    router.post('/add', [ProductsController, 'create']).as('products.add')
    router
      .get('/image/:id', [ProductsController, 'showImage'])
      .where('id', router.matchers.number())
    router.delete('/:id', [ProductsController, 'delete']).where('id', router.matchers.number())
    router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.number())
    router.get('/addNew', [ProductsController, 'addForm']).as('products.addForm')
  })
  .prefix('products')
