// database/seeders/RolePermissionSeeder.js
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    // Get roles
    const superAdmin = (await Role.findBy('name', 'super_admin')) as Role | null
    const admin = await Role.findBy('name', 'admin')
    const user = await Role.findBy('name', 'user')
    const supplier = await Role.findBy('name', 'supplier')
    const advertiser = await Role.findBy('name', 'advertiser')

    // Get all permissions
    const allPermissions = await Permission.all()

    // Super Admin gets ALL permissions
    if (superAdmin) {
      await superAdmin.related('permissions').attach(allPermissions.map((p) => p.id))
    }

    // Admin gets limited permissions (exclude super admin access)
    const adminPermissions = await Permission.query()
      .whereNot('name', 'super_admin_access')
      .whereNot('name', 'backup_restore_data')
      .whereNot('name', 'manage_system_settings')

    if (admin) {
      await admin.related('permissions').attach(adminPermissions.map((p) => p.id))
    }

    // Regular User permissions
    const userPermissions = await Permission.query().whereIn('name', [
      'create_adverts',
      'edit_adverts',
    ])

    if (user) {
      await user.related('permissions').attach(userPermissions.map((p) => p.id))
    }

    // Supplier permissions
    const supplierPermissions = await Permission.query().whereIn('name', [
      'create_adverts',
      'edit_adverts',
      'manage_supplier_products',
    ])

    if (supplier) {
      await supplier.related('permissions').attach(supplierPermissions.map((p) => p.id))
    }

    // Advertiser permissions
    const advertiserPermissions = await Permission.query().whereIn('name', [
      'create_adverts',
      'edit_adverts',
      'view_adverts',
    ])

    if (advertiser) {
      await advertiser.related('permissions').attach(advertiserPermissions.map((p) => p.id))
    }
  }
}
