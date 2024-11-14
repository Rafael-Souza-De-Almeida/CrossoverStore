import User from '#models/user'
import { createUserValidator } from '#validators/users'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  create({ view }: HttpContext) {
    return view.render('pages/users/signUp')
  }

  async save({ request, response }: HttpContext) {
    const createUser = await request.validateUsing(createUserValidator)

    const user = new User()

    user.merge(createUser)

    await user.save()

    return response.redirect().toRoute('auth.create')
  }
}
