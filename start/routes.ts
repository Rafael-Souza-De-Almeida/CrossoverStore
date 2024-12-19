import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import User from '#models/user'

const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const CartsController = () => import('#controllers/carts_controller')

router.get('/', [ProductsController, 'index']).as('products.home')

router.get('/login', [AuthController, 'create']).as('auth.create')
router.post('/login', [AuthController, 'save']).as('auth.save')
router.get('/logout', [AuthController, 'delete']).use(middleware.auth()).as('auth.logout')

router.get('/sign-up', [UsersController, 'create']).as('users.create')
router.post('/sign-up', [UsersController, 'save']).as('users.save')
router.get('/user/edit', [UsersController, 'edit']).use(middleware.auth()).as('users.edit')
router.post('/user/update', [UsersController, 'update']).use(middleware.auth()).as('users.update')

router
  .get('/user/profile-pic/show', [UsersController, 'showProfilePic'])
  .use(middleware.auth())
  .as('user.profile_picture')

router.get('/cart', [CartsController, 'show']).use(middleware.auth()).as('cart.show')
router.post('/cart/add', [CartsController, 'add']).use(middleware.auth()).as('cart.add')
router.delete('/cart/delete', [CartsController, 'delete']).use(middleware.auth()).as('cart.delete')

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
      .get('/image/show/:id', [ProductsController, 'showImage'])
      .where('id', router.matchers.number())
      .as('show.image')
    router.delete('/:id', [ProductsController, 'delete']).where('id', router.matchers.number())
    router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.number())
    router
      .get('/addNew', [ProductsController, 'addForm'])
      .as('products.addForm')
      .use(middleware.auth_admin())
  })
  .prefix('products')
