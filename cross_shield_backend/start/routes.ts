import Route from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Public Routes
Route.group(() => {
  Route.get('/', async () => ({
    message: 'Cross Shield Backend API',
    version: '1.0.0',
    status: 'active',
  }))

  Route.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
}).prefix('/api')

// Auth Routes
Route.group(() => {
  Route.post('/register', '#controllers/http/auth_controller.register')
  Route.post('/login', '#controllers/http/auth_controller.login')
  Route.post('/logout', '#controllers/http/auth_controller.logout')
  Route.post('/forgot-password', '#controllers/http/auth_controller.forgotPassword')
  Route.post('/reset-password', '#controllers/http/auth_controller.resetPassword')
  Route.post('/change-password', '#controllers/http/auth_controller.changePassword').middleware(
    middleware.auth({ guards: ['api'] })
  )
  Route.get('/me', '#controllers/http/auth_controller.me').middleware(
    middleware.auth({ guards: ['api'] })
  )

  Route.group(() => {
    Route.get('/all-health_practitioner', '#controllers/http/health_practitioner_controller.index')
    Route.get('/health_practitioner/:id', '#controllers/http/health_practitioner_controller.show')
    Route.put('/health_practitioner/:id', '#controllers/http/health_practitioner_controller.update')
    Route.post(
      '/health-practitioners/:id/respond',
      '#controllers/http/health_practitioner_controller.respond'
    )
    Route.post('/health_practitioner', '#controllers/http/health_practitioner_controller.store')
  }).middleware(middleware.auth({ guards: ['api'] }))
}).prefix('/api/auth')

// Protected API Routes (Authenticated Users)
Route.group(() => {
  Route.post(
    '/medication-requests/:id/assign',
    '#controllers/http/medication_requests_controller.assign'
  )

  Route.get(
    '/medication-requests/assigned',
    '#controllers/http/medication_requests_controller.assignedList'
  )
  Route.resource('medication-requests', '#controllers/http/medication_requests_controller')

  Route.get('/all-suppliers', '#controllers/http/products_controller.index')
  Route.post('/suppliers', '#controllers/http/products_controller.store')
  Route.put('/suppliers/:id', '#controllers/http/products_controller.update')
  Route.get('/suppliers/:id', '#controllers/http/products_controller.show')
  Route.delete('/suppliers/:id', '#controllers/http/products_controller.destroy')
  Route.post('/suppliers/:id/approve', '#controllers/http/products_controller.approve')
  Route.post('/suppliers/:id/reject', '#controllers/http/products_controller.reject')

  Route.resource('beneficiaries', '#controllers/http/beneficiary_controller')
  Route.resource('users', '#controllers/http/users_controller')
  Route.get('/user/:id', '#controllers/http/users_controller.show')
  Route.post('/users/:id/approve', '#controllers/http/users_controller.approve')
  Route.post('/users/:id/suspend', '#controllers/http/users_controller.suspend')
})
  .prefix('/api')
  .middleware(middleware.auth({ guards: ['api'] }))

// File Upload Routes
Route.group(() => {
  Route.post('/upload', async ({ response }) => {
    return response.json({ message: 'File upload endpoint' })
  })
})
  .prefix('/api')
  .middleware(middleware.auth({ guards: ['api'] }))

// Super Admin Routes
Route.group(() => {
  Route.get('/stats', '#controllers/http/super_admin_controller.viewStats')
  Route.get(
    '/pending-registrations',
    '#controllers/http/super_admin_controller.viewPendingRegistrations'
  )
  Route.get('/users', '#controllers/http/super_admin_controller.viewUsers')
  Route.patch('/users/:id', '#controllers/http/super_admin_controller.manageUserStatus')
  Route.patch('/registrations/:id', '#controllers/http/super_admin_controller.handleRegistration')
  Route.patch('/users/:id/revoke', '#controllers/http/super_admin_controller.revokeUserAccess')
  Route.patch('/users/:id/restore', '#controllers/http/super_admin_controller.restoreUserAccess')
  Route.delete('/users/:id', '#controllers/http/super_admin_controller.deleteUser')
  Route.patch('/users/:id/assign-role', '#controllers/http/super_admin_controller.assignRole')
  Route.patch(
    '/users/:id/reset-password',
    '#controllers/http/super_admin_controller.resetUserPassword'
  )
  Route.get('/users/:id/activity', '#controllers/http/super_admin_controller.viewUserActivity')
  Route.get('/adverts/pending', '#controllers/http/super_admin_controller.viewPendingAdverts')
  Route.patch('/adverts/:id', '#controllers/http/super_admin_controller.handleAdvert')
  Route.get('/suppliers/pending', '#controllers/http/super_admin_controller.viewPendingSuppliers')
  Route.patch('/suppliers/:id', '#controllers/http/super_admin_controller.handleSupplier')
  Route.get('/roles', '#controllers/http/super_admin_controller.viewRoles')
})
  .prefix('/api/super-admin')
  .middleware([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['super_admin'])])

// Admin Routes
Route.group(() => {
  Route.get('/users', '#controllers/http/super_admin_controller.viewUsers').middleware(
    middleware.checkPermission(['view_users'])
  )
  Route.patch(
    '/users/:id/revoke',
    '#controllers/http/super_admin_controller.revokeUserAccess'
  ).middleware(middleware.checkPermission(['revoke_user_access']))
  Route.delete('/users/:id', '#controllers/http/super_admin_controller.deleteUser').middleware(
    middleware.checkPermission(['delete_users'])
  )
  Route.get(
    '/pending-registrations',
    '#controllers/http/super_admin_controller.viewPendingRegistrations'
  ).middleware(middleware.checkPermission(['approve_registrations']))
  Route.patch(
    '/registrations/:id',
    '#controllers/http/super_admin_controller.handleRegistration'
  ).middleware(middleware.checkPermission(['approve_registrations']))
  Route.get(
    '/adverts/pending',
    '#controllers/http/super_admin_controller.viewPendingAdverts'
  ).middleware(middleware.checkPermission(['view_adverts']))
  Route.patch('/adverts/:id', '#controllers/http/super_admin_controller.handleAdvert').middleware(
    middleware.checkPermission(['approve_adverts', 'reject_adverts'])
  )
  Route.get(
    '/suppliers/pending',
    '#controllers/http/super_admin_controller.viewPendingSuppliers'
  ).middleware(middleware.checkPermission(['view_suppliers']))
  Route.patch(
    '/suppliers/:id',
    '#controllers/http/super_admin_controller.handleSupplier'
  ).middleware(middleware.checkPermission(['approve_suppliers']))
  Route.get('/roles', '#controllers/http/super_admin_controller.viewRoles').middleware(
    middleware.checkPermission(['manage_roles'])
  )
  Route.patch(
    '/users/:id/assign-role',
    '#controllers/http/super_admin_controller.assignRole'
  ).middleware(middleware.checkPermission(['assign_roles']))
})
  .prefix('/api/admin')
  .middleware(middleware.auth({ guards: ['api'] }))

Route.group(() => {
  Route.post('/referrals', '#controllers/http/referrals_controller.store')
  Route.get('/referrals', '#controllers/http/referrals_controller.index')
  Route.post('/referrals/code/:code/redeem', '#controllers/http/referrals_controller.redeem')
})
  .prefix('/api')
  .middleware(middleware.auth({ guards: ['api'] }))

// Public lookup by code, does not require auth
Route.get('/api/referrals/code/:code', '#controllers/http/referrals_controller.findByCode')

// Admin only routes
Route.group(() => {
  Route.get('/referrals/all', '#controllers/http/referrals_controller.all')
})
  .prefix('/api')
  .use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['super_admin'])])
