import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'admin',
      role: 'admin',
    })
    // await Product.create({
    //   name: 'Camiseta De’Aaron Fox',
    //   price: 199.99,
    //   type: 'camisa',
    //   description: 'Camisa oficial do De’Aaron Fox, jogador do Sacramento Kings.',
    //   image_path: 'storage/uploads/vcdm6j7sbwh5enbd9swx64tk.jpg',
    // })
  }
}
