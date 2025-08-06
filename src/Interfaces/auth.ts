export interface User {
    id: number
    full_name: string
    email: string
    phone: string
    status: 'pending' | 'active' | 'suspended' | 'rejected'
    location?: string
    license_number?: string
    business_name?: string
    role: Role
    created_at: string
    updated_at: string
  }
  
  export interface Role {
    id: number
    name: string
    description?: string
    is_active: boolean
    permissions?: Permission[]
  }
  
  export interface Permission {
    id: number
    name: string
    description?: string
  }
  