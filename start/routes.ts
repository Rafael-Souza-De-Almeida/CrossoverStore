import router from '@adonisjs/core/services/router'
import { create } from 'domain'

const ProductsController = () => import('#controllers/products_controller')

router
  .group(() => {
    router.post('/add', [ProductsController, 'create'])
  })
  .prefix('products')
