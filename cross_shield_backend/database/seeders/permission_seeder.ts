// database/seeders/PermissionSeeder.js
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class PermissionSeeder extends BaseSeeder {
  async run() {
    const permissions = [
      // User Management Permissions
      {
        name: 'view_users',
        description: 'View all users',
        module: 'users',
        action: 'view',
      },
      {
        name: 'approve_registrations',
        description: 'Approve or reject user registrations',
        module: 'users',
        action: 'approve',
      },
      {
        name: 'delete_users',
        description: 'Delete users from system',
        module: 'users',
        action: 'delete',
      },
      {
        name: 'revoke_user_access',
        description: 'Suspend or revoke user access',
        module: 'users',
        action: 'revoke',
      },
      {
        name: 'reset_user_passwords',
        description: 'Reset user passwords',
        module: 'users',
        action: 'reset_password',
      },
      {
        name: 'view_user_activity',
        description: 'View user login history and activity',
        module: 'users',
        action: 'view_activity',
      },

      // Role Management Permissions
      {
        name: 'manage_roles',
        description: 'Create, update, delete roles',
        module: 'roles',
        action: 'manage',
      },
      {
        name: 'assign_roles',
        description: 'Assign roles to users',
        module: 'roles',
        action: 'assign',
      },

      // Advertisement Management Permissions
      {
        name: 'view_adverts',
        description: 'View all advertisements',
        module: 'adverts',
        action: 'view',
      },
      {
        name: 'approve_adverts',
        description: 'Approve pending advertisements',
        module: 'adverts',
        action: 'approve',
      },
      {
        name: 'reject_adverts',
        description: 'Reject advertisements',
        module: 'adverts',
        action: 'reject',
      },
      {
        name: 'delete_adverts',
        description: 'Delete advertisements',
        module: 'adverts',
        action: 'delete',
      },
      {
        name: 'create_adverts',
        description: 'Create new advertisements',
        module: 'adverts',
        action: 'create',
      },
      {
        name: 'edit_adverts',
        description: 'Edit existing advertisements',
        module: 'adverts',
        action: 'edit',
      },

      // Supplier Management Permissions
      {
        name: 'view_suppliers',
        description: 'View all suppliers',
        module: 'suppliers',
        action: 'view',
      },
      {
        name: 'approve_suppliers',
        description: 'Approve supplier requests',
        module: 'suppliers',
        action: 'approve',
      },
      {
        name: 'reject_suppliers',
        description: 'Reject supplier requests',
        module: 'suppliers',
        action: 'reject',
      },
      {
        name: 'manage_supplier_products',
        description: 'Manage supplier products',
        module: 'suppliers',
        action: 'manage_products',
      },

      // System Administration Permissions
      {
        name: 'super_admin_access',
        description: 'Full system administrator access',
        module: 'system',
        action: 'admin',
      },
      {
        name: 'view_system_logs',
        description: 'View system logs and audit trails',
        module: 'system',
        action: 'view_logs',
      },
      {
        name: 'manage_system_settings',
        description: 'Modify system configurations',
        module: 'system',
        action: 'manage_settings',
      },
      {
        name: 'backup_restore_data',
        description: 'Perform database backups and restorations',
        module: 'system',
        action: 'backup_restore',
      },

      // Financial Management Permissions
      {
        name: 'view_transactions',
        description: 'View all financial transactions',
        module: 'finance',
        action: 'view',
      },
      {
        name: 'manage_payments',
        description: 'Handle payments and refunds',
        module: 'finance',
        action: 'manage',
      },
      {
        name: 'generate_financial_reports',
        description: 'Generate financial reports',
        module: 'finance',
        action: 'generate_reports',
      },

      // Content Management Permissions
      {
        name: 'moderate_content',
        description: 'Moderate user-generated content',
        module: 'content',
        action: 'moderate',
      },
      {
        name: 'send_notifications',
        description: 'Send system-wide notifications',
        module: 'content',
        action: 'send_notifications',
      },
      {
        name: 'manage_categories',
        description: 'Manage categories and tags',
        module: 'content',
        action: 'manage_categories',
      },
      {
        name: 'super_admin',
        description: 'Alias for full admin access',
        module: 'system',
        action: 'admin',
      },
    ]
    for (const permission of permissions) {
      await Permission.firstOrCreate({ name: permission.name }, permission)
    }
    // await Permission.createMany(permissions)
  }
}
