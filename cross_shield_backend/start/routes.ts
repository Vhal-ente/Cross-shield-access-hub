/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Public route
router.get('/', async () => {
  return {
    message: 'Cross Shield Backend API',
    version: '1.0.0',
    status: 'active',
  }
})

// Health check
router.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})

// Auth routes
router
  .group(() => {
    router.post('/register', 'AuthController.register')
    router.post('/login', 'AuthController.login')
    router.post('/logout', 'AuthController.logout').use('auth')
    router.get('/me', 'AuthController.me').use('auth')
  })
  .prefix('/api/auth')

// Protected routes
router
  .group(() => {
    // Medication requests
    router.resource('medication-requests', 'MedicationRequestsController').apiOnly()

    // Products
    router.resource('products', 'ProductsController').apiOnly()
    router.post('products/:id/approve', 'ProductsController.approve')
    router.post('products/:id/reject', 'ProductsController.reject')

    // Beneficiaries
    router.resource('beneficiaries', 'BeneficiariesController').apiOnly()

    // Users (admin only)
    router.resource('users', 'UsersController').apiOnly().except(['store'])
    router.post('users/:id/approve', 'UsersController.approve')
    router.post('users/:id/suspend', 'UsersController.suspend')
  })
  .prefix('/api')
  .use('auth')

// File upload routes
router
  .group(() => {
    router.post('/upload', async ({ request, response }) => {
      // Handle file uploads here
      return response.json({ message: 'File upload endpoint' })
    })
  })
  .prefix('/api')
  .use('auth')
