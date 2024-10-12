import router from '@adonisjs/core/services/router'
import { create } from 'domain'

const ProductsController = () => import('#controllers/products_controller')

router.post('/products/add', [ProductsController, 'create'])