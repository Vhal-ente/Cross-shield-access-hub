# Cross Shield Backend API

AdonisJS backend for the Cross Shield Access Hub project.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for multiple user roles (Super Admin, Health Practitioners, Suppliers, Diaspora, Beneficiaries)
- **Medication Requests**: Complete CRUD operations for medication requests
- **Product Management**: Suppliers can advertise products, admins can approve/reject
- **Beneficiary Management**: Diaspora users can manage their beneficiaries
- **File Uploads**: Support for prescription images and product photos
- **Database**: SQLite for development, easily configurable for production databases

## User Roles

1. **Super Admin**: Manage all users, approve products, oversee all requests
2. **Health Practitioner**: Fulfill requests, refer patients, source medications
3. **Supplier**: Respond to requests, advertise products
4. **Diaspora**: Manage beneficiaries, request medications for family
5. **Beneficiary**: Request medications, place special orders

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Medication Requests
- `GET /api/medication-requests` - List requests (filtered by role)
- `POST /api/medication-requests` - Create new request
- `GET /api/medication-requests/:id` - Get specific request
- `PUT /api/medication-requests/:id` - Update request
- `DELETE /api/medication-requests/:id` - Delete request

### Products
- `GET /api/products` - List products (filtered by role)
- `POST /api/products` - Create new product (suppliers only)
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/approve` - Approve product (admin only)
- `POST /api/products/:id/reject` - Reject product (admin only)

### Beneficiaries
- `GET /api/beneficiaries` - List beneficiaries
- `POST /api/beneficiaries` - Create new beneficiary (diaspora only)
- `GET /api/beneficiaries/:id` - Get specific beneficiary
- `PUT /api/beneficiaries/:id` - Update beneficiary
- `DELETE /api/beneficiaries/:id` - Delete beneficiary

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/approve` - Approve user
- `POST /api/users/:id/suspend` - Suspend user

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Generate App Key**
   ```bash
   node ace generate:key
   ```

4. **Run Migrations**
   ```bash
   node ace migration:run
   ```

5. **Seed Database**
   ```bash
   node ace db:seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## Default Users

After seeding, you can login with these accounts:

- **Super Admin**: admin@crossshield.com / password123
- **Health Practitioner**: doctor@crossshield.com / password123
- **Supplier**: supplier@crossshield.com / password123
- **Diaspora**: diaspora@crossshield.com / password123

## Database Schema

The backend uses the following main tables:
- `users` - All user accounts with role-based access
- `medication_requests` - Medication requests from users
- `products` - Products advertised by suppliers
- `beneficiaries` - Beneficiaries managed by diaspora users

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- CORS configuration for frontend integration
- SQL injection prevention through ORM

## Production Deployment

For production deployment:

1. Update `.env` with production database credentials
2. Set `NODE_ENV=production`
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use a process manager like PM2
6. Set up database backups
7. Configure logging and monitoring

## Integration with Frontend

The backend is configured to work with the React frontend running on:
- Development: `http://localhost:5173` or `http://localhost:3000`
- Production: `https://vhal-ente.github.io`

Make sure to update CORS settings in `config/cors.ts` for your specific deployment URLs.