import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { 
    message: 'Cross Shield Backend API',
    version: '1.0.0',
    status: 'active'
  }
})

// Health check
Route.get('/health', async () => {
  return { 
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

// Auth routes
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout').middleware('auth')
  Route.get('/me', 'AuthController.me').middleware('auth')
}).prefix('/api/auth')

// Protected routes
Route.group(() => {
  // Medication requests
  Route.resource('medication-requests', 'MedicationRequestsController').apiOnly()
  
  // Products
  Route.resource('products', 'ProductsController').apiOnly()
  Route.post('products/:id/approve', 'ProductsController.approve')
  Route.post('products/:id/reject', 'ProductsController.reject')
  
  // Beneficiaries
  Route.resource('beneficiaries', 'BeneficiariesController').apiOnly()
  
  // Users (admin only)
  Route.resource('users', 'UsersController').apiOnly().except(['store'])
  Route.post('users/:id/approve', 'UsersController.approve')
  Route.post('users/:id/suspend', 'UsersController.suspend')
  
}).prefix('/api').middleware('auth')

// File upload routes
Route.group(() => {
  Route.post('/upload', async ({ request, response }) => {
    // Handle file uploads here
    return response.json({ message: 'File upload endpoint' })
  })
}).prefix('/api').middleware('auth')