// /*
// |--------------------------------------------------------------------------
// | Routes file
// |--------------------------------------------------------------------------

// | The routes file is used for defining the HTTP routes.
// |
// */

// import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js' // Adjust the path as necessary

// // Public route
// router.get('/', async () => {
//   return {
//     message: 'Cross Shield Backend API',
//     version: '1.0.0',
//     status: 'active',
//   }
// })

// // Health check
// router.get('/health', async () => {
//   return {
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//   }
// })

// // Auth routes
// router
//   .group(() => {
//     router.post('/register', '#controllers/http/auth_controller.register')
//     router.post('/login', '#controllers/http/auth_controller.login')

//     router.post('/logout', '#controllers/http/auth_controller.logout').middleware(['auth'])
//     router.get('/me', '#controllers/http/auth_controller.me').middleware(['auth'])

//     router
//       .group(() => {
//         router.get('/requests', '#controllers/requests_controller.index')
//         router.get('/requests/:id', '#controllers/requests_controller.show')
//         router.put('/requests/:id', '#controllers/requests_controller.update')
//       })
//       .middleware(middleware.auth())
//   })
//   .prefix('/api/auth')

// // Protected routes
// router
//   .group(() => {
//     // Medication requests
//     router.resource('medication-requests', '#controllers/http/medication_requests_controller')

//     // Products
//     router.resource('products', '#controllers/http/products_controller')
//     router.post('products/:id/approve', '#controllers/http/products_controller.approve')
//     router.post('products/:id/reject', '#controllers/http/products_controller.reject')

//     // Beneficiaries
//     router.resource('beneficiaries', '#controllers/http/beneficiaries_controller')

//     // Users (admin only)
//     router.resource('users', '#controllers/http/users_controller').except(['store'])
//     router.post('users/:id/approve', '#controllers/http/users_controller.approve')
//     router.post('users/:id/suspend', '#controllers/http/users_controller.suspend')
//   })
//   .prefix('/api')
//   .middleware(['auth'])

// // File upload routes
// router
//   .group(() => {
//     router.post('/upload', async ({ request, response }) => {
//       // Handle file uploads here
//       return response.json({ message: 'File upload endpoint' })
//     })
//   })
//   .prefix('/api')
//   .use('auth')

// // Super Admin Routes Group
// router
//   .group(() => {
//     // Dashboard & Statistics
//     router.get('/stats', '#controllers/http/super_admin_controller.viewStats')

//     // User Registration Management
//     router.get(
//       '/pending-registrations',
//       '#controllers/http/super_admin_controller.viewPendingRegistrations'
//     )
//     // router.patch(
//     //   '/registrations/:id',
//     //   '#controllers/http/super_admin_controller.handleRegistration'
//     // )

//     // User Management
//     router.get('/users', '#controllers/http/super_admin_controller.viewUsers')
//     router.patch('/users/:id', '#controllers/http/super_admin_controller.handleUser')
//     router.patch('/users/:id/revoke', '#controllers/http/super_admin_controller.revokeUserAccess')
//     router.patch('/users/:id/restore', '#controllers/http/super_admin_controller.restoreUserAccess')
//     router.delete('/users/:id', '#controllers/http/super_admin_controller.deleteUser')
//     router.patch('/users/:id/assign-role', '#controllers/http/super_admin_controller.assignRole')
//     router.patch(
//       '/users/:id/reset-password',
//       '#controllers/http/super_admin_controller.resetUserPassword'
//     )
//     router.get('/users/:id/activity', '#controllers/http/super_admin_controller.viewUserActivity')

//     // Advertisement Management
//     router.get('/adverts/pending', '#controllers/http/super_admin_controller.viewPendingAdverts')
//     router.patch('/adverts/:id', '#controllers/http/super_admin_controller.handleAdvert')

//     // Supplier Management
//     router.get(
//       '/suppliers/pending',
//       '#controllers/http/super_admin_controller.viewPendingSuppliers'
//     )
//     router.patch('/suppliers/:id', '#controllers/http/super_admin_controller.handleSupplier')

//     // Role Management
//     router.get('/roles', '#controllers/http/super_admin_controller.viewRoles')
//   })
//   .prefix('/api/super-admin')
// // .middleware(['auth'])
// // .use(['auth', 'checkPermission'])

// // Additional routes with specific permissions
// router
//   .group(() => {
//     // User management with specific permissions
//     router
//       .get('/users', '#controllers/http/super_admin_controller.viewUsers')
//       .use(middleware.checkPermission(['view_users']))

//     router
//       .patch('/users/:id/revoke', '#controllers/http/super_admin_controller.revokeUserAccess')
//       .use(middleware.checkPermission(['revoke_user_access']))

//     router
//       .delete('/users/:id', '#controllers/http/super_admin_controller.deleteUser')
//       .use(middleware.checkPermission(['delete_users']))

//     // Registration approvals
//     router
//       .get(
//         '/pending-registrations',
//         '#controllers/http/super_admin_controller.viewPendingRegistrations'
//       )
//       .use(middleware.checkPermission(['approve_registrations']))

//     router
//       .patch('/registrations/:id', '#controllers/http/super_admin_controller.handleRegistration')
//       .use(middleware.checkPermission(['approve_registrations']))

//     // Advert management
//     router
//       .get('/adverts/pending', '#controllers/http/super_admin_controller.viewPendingAdverts')
//       .use(middleware.checkPermission(['view_adverts']))

//     router
//       .patch('/adverts/:id', '#controllers/http/super_admin_controller.handleAdvert')
//       .use(middleware.checkPermission(['approve_adverts', 'reject_adverts']))

//     // Supplier management
//     router
//       .get('/suppliers/pending', '#controllers/http/super_admin_controller.viewPendingSuppliers')
//       .use(middleware.checkPermission(['view_suppliers']))

//     router
//       .patch('/suppliers/:id', '#controllers/http/super_admin_controller.handleSupplier')
//       .use(middleware.checkPermission(['approve_suppliers']))

//     // Role management
//     router
//       .get('/roles', '#controllers/http/super_admin_controller.viewRoles')
//       .use(middleware.checkPermission(['manage_roles']))

//     router
//       .patch('/users/:id/assign-role', '#controllers/http/super_admin_controller.assignRole')
//       .use(middleware.checkPermission(['assign_roles']))
//   })
//   .prefix('/api/admin')
//   .use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------

| Defines HTTP routes for the Cross Shield Backend API.
|
*/

import Route from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel' // Adjust path if needed

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
  Route.post('/logout', '#controllers/http/auth_controller.logout').use(
    middleware.auth({
      // allowedRoles: ['super_admin', 'manager', 'managing_admin'],
      guards: ['api'],
    })
  )
  Route.get('/me', '#controllers/http/auth_controller.me').use(
    middleware.auth({
      // allowedRoles: ['super_admin', 'manager', 'managing_admin'],
      guards: ['api'],
    })
  )
  // Route.group(() => {
  //   Route.get('/requests', '#controllers/requests_controller.index')
  //   Route.get('/requests/:id', '#controllers/requests_controller.show')
  //   Route.put('/requests/:id', '#controllers/requests_controller.update')
  // }).middleware(middleware.auth({ guards: ['api'] })) // Specify guard if needed
}).prefix('/api/auth')

// Protected API Routes (Authenticated Users)
Route.group(() => {
  Route.resource('medication-requests', '#controllers/http/medication_requests_controller')
  Route.resource('products', '#controllers/http/products_controller')
  Route.post('products/:id/approve', '#controllers/http/products_controller.approve')
  Route.post('products/:id/reject', '#controllers/http/products_controller.reject')
  Route.resource('beneficiaries', '#controllers/http/beneficiaries_controller')
  Route.resource('users', '#controllers/http/users_controller').except(['store'])
  Route.post('users/:id/approve', '#controllers/http/users_controller.approve')
  Route.post('users/:id/suspend', '#controllers/http/users_controller.suspend')
})
  .prefix('/api')
  .middleware(middleware.auth({ guards: ['api'] }))

// File Upload Routes
Route.group(() => {
  Route.post('/upload', async ({ request, response }) => {
    // Handle file uploads here
    return response.json({ message: 'File upload endpoint' })
  }) // Move to controller
})
  .prefix('/api')
  .middleware(middleware.auth({ guards: ['api'] }))

// Super Admin Routes (Authenticated, Super Admin Only)
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
  .use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['super_admin'])])

// Admin Routes (Authenticated, Permission-Based)
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
