import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'super_admin',
        displayName: 'Super Administrator', // Add this
        description: 'Super Administrator with all permissions',
      },
      {
        name: 'health_practitioner',
        displayName: 'Health Practitioner', // Add this
        description: 'Healthcare professional user',
      },
      {
        name: 'supplier',
        displayName: 'Supplier', // Add this
        description: 'Medical supplies supplier',
      },
      {
        name: 'diaspora',
        displayName: 'Diaspora', // Add this
        description: 'Diaspora community member',
      },
      {
        name: 'beneficiary',
        displayName: 'Beneficiary', // Add this
        description: 'Healthcare service beneficiary',
      },
    ])
  }
}
