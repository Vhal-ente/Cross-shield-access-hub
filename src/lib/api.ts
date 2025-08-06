
// export const API_BASE_URL = import.meta.env.VITE_API_URL;

// export interface User {
//   createdAt: string;
//   updatedAt: string;
//   id: number;
//   fullName: string;
//   email: string;
//   phone: string;
//   role: {
//     id: number;
//     name: string;
//     description?: string;
//     is_active: boolean;
//     permissions?: Permissions[];
//   };
//   status: 'active' | 'pending' | 'suspended' | 'rejected';
//   location?: string;
//   licenseNumber?: string;
//   businessName?: string;
// }

// let token: string | null = localStorage.getItem("auth_token");

// function setToken(newToken: string) {
//   token = newToken;
//   localStorage.setItem("auth_token", newToken);
// }

// function clearToken() {
//   token = null;
//   localStorage.removeItem("auth_token");
//   localStorage.removeItem("user");
// }

// function getCurrentUserFromStorage(): User | null {
//   const userStr = localStorage.getItem("user");
//   return userStr ? JSON.parse(userStr) : null;
// }

// function isAuthenticated(): boolean {
//   return !!token;
// }

// async function request<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const config: RequestInit = {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers
//     },
//     ...options
//   };
//   // Add these debug logs
//   console.log('Making request to:', url);
//   console.log('Request config:', config);
//   if (options.body) {
//     console.log('Request body:', options.body);
//   }

//   const response = await fetch(url, config);
//     // Add this debug log
//     console.log('Response status:', response.status);
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     console.log('Error response data:', errorData); // Add this
//     throw new Error(
//       errorData.message || `HTTP error! status: ${response.status}`
//     );
//   }

//   return response.json();
// }

// export const apiClient = {
//   // Auth methods
//   login: async (email: string, password: string) => {
//     const res = await request<{
//       message: string;
//       user: User;
//       token: string;
//     }>("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });
  
//     // 🔐 Store token for future requests
//     setToken(res.token); // if using global state
//     localStorage.setItem("auth_token", res.token); // for persistence
//     localStorage.setItem("user", JSON.stringify(res.user));
  
//     return res;
//   },
  

//   register: async (
//     userData: Omit<User, "id" | "status"> & { password: string }
//   ) => {
//     return request<{ message: string; user: User }>("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(userData)
//     });
//   },

//   logout: async () => {
//     try {
//       await request("/auth/logout", { method: "POST" });
//     } finally {
//       clearToken();
//     }
//   },

//   getCurrentUser: () => request<{ user: User }>("/auth/me"),

//   // Medication Requests
//   getMedicationRequests: () =>
//     request<{ requests: unknown[] }>("/medication-requests"),
//   createMedicationRequest: (data: {
//     medicationName: string;
//     quantity: number;
//     urgency: "normal" | "urgent" | "emergency";
//     medicalCondition?: string;
//     notes?: string;
//     beneficiaryId?: number;
//   }) =>
//     request<{ message: string; request: unknown }>("/medication-requests", {
//       method: "POST",
//       body: JSON.stringify(data)
//     }),

//   updateMedicationRequest: (
//     id: number,
//     data: {
//       status?: "pending" | "in_progress" | "fulfilled" | "cancelled";
//       assignedTo?: number;
//       price?: number;
//       notes?: string;
//     }
//   ) =>
//     request<{
//       message: string;
//       request: unknown;
//     }>(`/medication-requests/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(data)
//     }),

//   deleteMedicationRequest: (id: number) =>
//     request<{ message: string }>(`/medication-requests/${id}`, {
//       method: "DELETE"
//     }),

//   // Products
//   getProducts: () => request<{ products: unknown[] }>("/products"),
//   createProduct: (data: {
//     name: string;
//     description?: string;
//     price: number;
//     quantity: number;
//     expiryDate: string;
//     nafdacNumber?: string;
//   }) =>
//     request<{ message: string; product: unknown }>("/products", {
//       method: "POST",
//       body: JSON.stringify(data)
//     }),

//   updateProduct: (id: number, data: Record<string, unknown>) =>
//     request<{ message: string; product: unknown }>(`/products/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(data)
//     }),

//   approveProduct: (id: number) =>
//     request<{ message: string; product: unknown }>(`/products/${id}/approve`, {
//       method: "POST"
//     }),

//   rejectProduct: (id: number) =>
//     request<{ message: string; product: unknown }>(`/products/${id}/reject`, {
//       method: "POST"
//     }),

//   deleteProduct: (id: number) =>
//     request<{ message: string }>(`/products/${id}`, { method: "DELETE" }),

//   // Beneficiaries
//   getBeneficiaries: () =>
//     request<{ beneficiaries: unknown[] }>("/beneficiaries"),
//   createBeneficiary: (data: {
//     name: string;
//     phone: string;
//     location: string;
//     medicationNeeds?: string;
//   }) =>
//     request<{ message: string; beneficiary: unknown }>("/beneficiaries", {
//       method: "POST",
//       body: JSON.stringify(data)
//     }),

//   updateBeneficiary: (id: number, data: Record<string, unknown>) =>
//     request<{ message: string; beneficiary: unknown }>(`/beneficiaries/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(data)
//     }),

//   deleteBeneficiary: (id: number) =>
//     request<{ message: string }>(`/beneficiaries/${id}`, { method: "DELETE" }),

//   // Users (Admin only)
//   getUsers: () => request<{ users: User[] }>("/users"),
//   updateUser: (id: number, data: Partial<User>) =>
//     request<{ message: string; user: User }>(`/users/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(data)
//     }),

//   approveUser: (id: number) =>
//     request<{ message: string; user: User }>(`/users/${id}/approve`, {
//       method: "POST"
//     }),

//   suspendUser: (id: number) =>
//     request<{ message: string; user: User }>(`/users/${id}/suspend`, {
//       method: "POST"
//     }),

//   deleteUser: (id: number) =>
//     request<{ message: string }>(`/users/${id}`, { method: "DELETE" }),

//   // Utility methods
//   setToken,
//   clearToken,
//   isAuthenticated,
//   getCurrentUserFromStorage
// };

// export default apiClient;


// src/api.ts
// src/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface User {
  createdAt: string;
  updatedAt: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    permissions?: unknown[];
  };
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  location?: string;
  licenseNumber?: string;
  businessName?: string;
}

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function clearToken() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

function getCurrentUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      console.warn('Unauthorized. Redirecting to login...');
      clearToken();
      window.location.href = '/login';
    }

    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await request<{ message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearToken();
    }
  },

  register: async (
    userData: Omit<User, 'id' | 'status'> & { password: string }
  ) => {
    return request<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: () => request<{ user: User }>('/auth/me'),

  // Utility methods
  setToken,
  clearToken,
  isAuthenticated,
  getCurrentUserFromStorage,

  // Users
  getUsers: async (
    page = 1,
    limit = 10,
    filters?: { status?: string; role?: string }
  ) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });

    if (filters?.status) params.append('status', filters.status);
    if (filters?.role) params.append('role', filters.role);

    return request<{ data: User[]; meta: any }>(`/super-admin/users?${params.toString()}`);
  },

  updateUser: (id: number, data: Partial<User>) =>
    request<{ message: string; user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  approveUser: (id: number) =>
    request<{ message: string; user: User }>(`/users/${id}/approve`, {
      method: 'POST',
    }),

  suspendUser: (id: number) =>
    request<{ message: string; user: User }>(`/users/${id}/suspend`, {
      method: 'POST',
    }),

  deleteUser: (id: number) =>
    request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export default apiClient;
