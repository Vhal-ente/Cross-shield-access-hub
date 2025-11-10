import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import User from '#models/user'
import HealthPractitioner from '#models/health_practitioner'

export default class extends BaseSeeder {
  public async run() {
    // ensure role exists
    const hpRole = await Role.firstOrCreate(
      { name: 'health_practitioner' },
      { name: 'health_practitioner', displayName: 'Health Practitioner', isActive: true }
    )

    // create or update the user
    const user = await User.updateOrCreate(
      { email: 'doc@example.com' },
      {
        fullName: 'Dr Jane Doe',
        email: 'doc@example.com',
        phone: '08000000000',
        location: 'Lagos',
        status: 'active',
        password: 'Password123!', // add this
        roleId: hpRole.id,
      }
    )

    // create or update the practitioner profile
    await HealthPractitioner.updateOrCreate(
      { userId: user.id },
      {
        specialization: 'Cardiology',
        licenseNumber: 'REG-12345',
        location: 'Lagos',
        status: 'active',
        payload: null,
      }
    )
  }
}
