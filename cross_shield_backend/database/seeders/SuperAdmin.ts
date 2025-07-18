import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Create super admin user
    await User.firstOrCreate(
      { email: 'admin@crossshield.com' },
      {
        fullName: 'Super Admin',
        email: 'admin@crossshield.com',
        phone: '+234-000-000-0000',
        password: 'password123',
        role: 'super_admin',
        status: 'active',
        location: 'Lagos, Nigeria'
      }
    )

    // Create sample health practitioner
    await User.firstOrCreate(
      { email: 'doctor@crossshield.com' },
      {
        fullName: 'Dr. John Smith',
        email: 'doctor@crossshield.com',
        phone: '+234-111-111-1111',
        password: 'password123',
        role: 'health_practitioner',
        status: 'active',
        location: 'Lagos, Nigeria',
        licenseNumber: 'MED-12345'
      }
    )

    // Create sample supplier
    await User.firstOrCreate(
      { email: 'supplier@crossshield.com' },
      {
        fullName: 'MediSupply Ltd',
        email: 'supplier@crossshield.com',
        phone: '+234-222-222-2222',
        password: 'password123',
        role: 'supplier',
        status: 'active',
        location: 'Abuja, Nigeria',
        businessName: 'MediSupply Limited'
      }
    )

    // Create sample diaspora user
    await User.firstOrCreate(
      { email: 'diaspora@crossshield.com' },
      {
        fullName: 'Jane Doe',
        email: 'diaspora@crossshield.com',
        phone: '+1-555-555-5555',
        password: 'password123',
        role: 'diaspora',
        status: 'active',
        location: 'New York, USA'
      }
    )
  }
}