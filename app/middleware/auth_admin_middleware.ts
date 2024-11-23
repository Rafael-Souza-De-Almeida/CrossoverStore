import { HttpContext } from '@adonisjs/core/http'

export default class auth_admin {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    if (!auth.user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    if (auth.user.role !== 'admin') {
      return response.forbidden({ message: 'Acesso negado' })
    }

    await next()
  }
}
