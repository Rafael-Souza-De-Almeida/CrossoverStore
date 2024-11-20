import User from '#models/user'
import { createUserValidator } from '#validators/users'
import { updateUserValidator } from '#validators/updateUser'
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

  async edit({ auth, view }: HttpContext) {
    const user = auth.use('web').user

    if (!user) {
      return view.render('pages/auth/login', { errors: { message: 'Usuário não autenticado' } })
    }

    return view.render('pages/users/edit', { user })
  }

  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.use('web').user

    if (!user) {
      session.flash({ errors: { message: 'Usuário não autenticado' } })
      return response.redirect().toRoute('auth.create')
    }

    try {
      const updatedData = await request.validateUsing(updateUserValidator)

      user.merge({
        fullName: updatedData.fullName,
        email: updatedData.email,
      })
      await user.save()

      return response.redirect().toRoute('products.home')
    } catch (exception) {
      session.flash({ errors: exception.messages })
      return response.redirect().back()
    }
  }
}
