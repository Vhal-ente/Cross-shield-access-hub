/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------

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
    router.post('/register', '#controllers/http/auth_controller.register')
    router.post('/login', '#controllers/http/auth_controller.login')

    router.post('/logout', '#controllers/http/auth_controller.logout').middleware(['auth'])
    router.get('/me', '#controllers/http/auth_controller.me').middleware(['auth'])
  })
  .prefix('/api/auth')

// Protected routes
router
  .group(() => {
    // Medication requests
    router.resource('medication-requests', '#controllers/http/medication_requests_controller')

    // Products
    router.resource('products', '#controllers/http/products_controller')
    router.post('products/:id/approve', '#controllers/http/products_controller.approve')
    router.post('products/:id/reject', '#controllers/http/products_controller.reject')

    // Beneficiaries
    router.resource('beneficiaries', '#controllers/http/beneficiaries_controller')

    // Users (admin only)
    router.resource('users', '#controllers/http/users_controller').except(['store'])
    router.post('users/:id/approve', '#controllers/http/users_controller.approve')
    router.post('users/:id/suspend', '#controllers/http/users_controller.suspend')
  })
  .prefix('/api')
  .middleware(['auth'])

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
