import User from '#models/user'
import { createUserValidator } from '#validators/users'
import { updateUserValidator } from '#validators/updateUser'
import { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class UsersController {
  create({ view }: HttpContext) {
    return view.render('pages/users/signUp')
  }

  async save({ request, response, session }: HttpContext) {
    const createUser = await request.validateUsing(createUserValidator)
    try {
      const user = new User()

      user.merge(createUser)

      await user.save()
    } catch (exception) {
      console.log(exception)
      session.flashOnly(['email'])
      session.flash({ errors: { login: 'Email Já utilizado' } })
      return response.redirect().back()
    }

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

      const profileImage = request.file('profile_picture', {
        size: '20mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      console.log(profileImage)

      let profileImagePath = user.profile_picture

      if (profileImage) {
        const uploadPath = 'storage/uploads'
        const fileName = `${cuid()}.${profileImage.extname}`

        console.log('Movendo a imagem para:', app.makePath(uploadPath))
        console.log('Nome do arquivo:', fileName)

        const moveResult = await profileImage.move(app.makePath(uploadPath), {
          name: fileName,
        })

        // if (profileImage.errors) {
        //   console.log('Erro ao mover a imagem:', profileImage.errors) // Verifica erros no upload
        //   throw new Error('Erro ao fazer upload da imagem')
        // }

        console.log('Imagem movida com sucesso para:', moveResult) // Log de sucesso
        profileImagePath = `${uploadPath}/${profileImage.fileName}`
      }

      console.log('Caminho atualizado da imagem:', profileImagePath) // Verifique o caminho final da imagem

      user.merge({
        fullName: updatedData.fullName,
        email: updatedData.email,
        profile_picture: profileImagePath,
      })

      await user.save()

      return response.redirect().toRoute('products.home')
    } catch (exception) {
      session.flash({ errors: exception.messages })
      return response.redirect().back()
    }
  }

  async showProfilePic({ response, auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized('Usuário não autenticado')
    }

    if (!user.profile_picture) {
      return response.notFound('Imagem de perfil não encontrada')
    }

    if (user.id !== auth.user?.id && auth.user?.role !== 'admin') {
      return response.forbidden('Acesso Negado')
    }

    const profilePicturePath = user.profile_picture
    return response.download(profilePicturePath)
  }
}
