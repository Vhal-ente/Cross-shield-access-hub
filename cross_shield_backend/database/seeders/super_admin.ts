// database/seeders/SuperAdminSeeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class extends BaseSeeder {
  public async run() {
    // Get the super_admin role
    const superAdminRole = await Role.findByOrFail('name', 'super_admin')

    // Check if super admin already exists
    const existingSuperAdmin = await User.query()
      .where('email', 'admin@crossshield.com')
      .orWhere('roleId', superAdminRole.id)
      .first()

    if (existingSuperAdmin) {
      console.log('Super Admin already exists, skipping creation...')

      // Optionally update the existing super admin to use the new role system
      if (!existingSuperAdmin.roleId) {
        existingSuperAdmin.roleId = superAdminRole.id
        await existingSuperAdmin.save()
        console.log('Updated existing Super Admin with new role system')
      }
      return
    }

    // Create super admin user with proper roleId
    const superAdmin = await User.create({
      fullName: 'Super Admin',
      email: 'admin@crossshield.com',
      phone: '+234-000-000-0000',
      password: 'password123',
      roleId: superAdminRole.id, // Use roleId instead of role
      status: 'active',
      location: 'Lagos, Nigeria',
    })

    console.log(`Super Admin created with email: ${superAdmin.email}`)

    // Get other roles for sample users
    const diasporaRole = await Role.findByOrFail('name', 'diaspora')

    // Create sample diaspora user
    await User.firstOrCreate(
      { email: 'diaspora@crossshield.com' },
      {
        fullName: 'Jane Doe',
        email: 'diaspora@crossshield.com',
        phone: '+1-555-555-5555',
        password: 'password123',
        roleId: diasporaRole.id,
        status: 'active',
        location: 'New York, USA',
      }
    )

    console.log('Sample users created successfully')
  }
}
