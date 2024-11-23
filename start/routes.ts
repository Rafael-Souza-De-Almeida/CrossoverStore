import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', [ProductsController, 'index']).as('products.home')

router.get('/login', [AuthController, 'create']).as('auth.create')
router.post('/login', [AuthController, 'save']).as('auth.save')
router.get('/logout', [AuthController, 'delete']).use(middleware.auth()).as('auth.logout')

router.get('/sign-up', [UsersController, 'create']).as('users.create')
router.post('/sign-up', [UsersController, 'save']).as('users.save')
router.get('/user/edit', [UsersController, 'edit']).use(middleware.auth()).as('users.edit')
router.post('/user/update', [UsersController, 'update']).use(middleware.auth()).as('users.update')

router
  .group(() => {
    router
      .get('/:id', [ProductsController, 'show'])
      .where('id', router.matchers.number())
      .as('products.show')

    router.get('/type', [ProductsController, 'findByType'])
    router
      .post('/add', [ProductsController, 'create'])
      .as('products.add')
      .use(middleware.auth_admin())
    router
      .get('/image/:id', [ProductsController, 'showImage'])
      .where('id', router.matchers.number())
    router.delete('/:id', [ProductsController, 'delete']).where('id', router.matchers.number())
    router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.number())
    router
      .get('/addNew', [ProductsController, 'addForm'])
      .as('products.addForm')
      .use(middleware.auth_admin())
  })
  .prefix('products')
