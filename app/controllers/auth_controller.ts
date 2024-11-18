import User from '#models/user'
import { createAuthValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async save({ auth, request, response, session }: HttpContext) {
    try {
      const validatingUser = await request.validateUsing(createAuthValidator)

      const user = await User.verifyCredentials(validatingUser.email, validatingUser.password)

      await auth.use('web').login(user)
      console.log(auth.isAuthenticated)
    } catch (exception) {
      session.flashOnly(['email'])
      session.flash({ errors: { login: 'Email ou senha incorretos' } })
      return response.redirect().back()
    }
    return response.redirect().toRoute('products.home')
  }

  async delete({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('auth.create')
  }
}
