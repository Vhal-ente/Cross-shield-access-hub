const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{
      message: string;
      user: any;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    location?: string;
    licenseNumber?: string;
    businessName?: string;
  }) {
    return this.request<{
      message: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Medication Requests
  async getMedicationRequests() {
    return this.request<{ requests: any[] }>('/medication-requests');
  }

  async createMedicationRequest(requestData: {
    medicationName: string;
    quantity: number;
    urgency: 'normal' | 'urgent' | 'emergency';
    medicalCondition?: string;
    notes?: string;
    beneficiaryId?: number;
  }) {
    return this.request<{
      message: string;
      request: any;
    }>('/medication-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateMedicationRequest(id: number, updateData: {
    status?: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled';
    assignedTo?: number;
    price?: number;
    notes?: string;
  }) {
    return this.request<{
      message: string;
      request: any;
    }>(`/medication-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteMedicationRequest(id: number) {
    return this.request<{ message: string }>(`/medication-requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Products
  async getProducts() {
    return this.request<{ products: any[] }>('/products');
  }

  async createProduct(productData: {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    expiryDate: string;
    nafdacNumber?: string;
  }) {
    return this.request<{
      message: string;
      product: any;
    }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, updateData: any) {
    return this.request<{
      message: string;
      product: any;
    }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async approveProduct(id: number) {
    return this.request<{
      message: string;
      product: any;
    }>(`/products/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectProduct(id: number) {
    return this.request<{
      message: string;
      product: any;
    }>(`/products/${id}/reject`, {
      method: 'POST',
    });
  }

  async deleteProduct(id: number) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Beneficiaries
  async getBeneficiaries() {
    return this.request<{ beneficiaries: any[] }>('/beneficiaries');
  }

  async createBeneficiary(beneficiaryData: {
    name: string;
    phone: string;
    location: string;
    medicationNeeds?: string;
  }) {
    return this.request<{
      message: string;
      beneficiary: any;
    }>('/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  async updateBeneficiary(id: number, updateData: any) {
    return this.request<{
      message: string;
      beneficiary: any;
    }>(`/beneficiaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteBeneficiary(id: number) {
    return this.request<{ message: string }>(`/beneficiaries/${id}`, {
      method: 'DELETE',
    });
  }

  // Users (Admin only)
  async getUsers() {
    return this.request<{ users: any[] }>('/users');
  }

  async updateUser(id: number, updateData: any) {
    return this.request<{
      message: string;
      user: any;
    }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async approveUser(id: number) {
    return this.request<{
      message: string;
      user: any;
    }>(`/users/${id}/approve`, {
      method: 'POST',
    });
  }

  async suspendUser(id: number) {
    return this.request<{
      message: string;
      user: any;
    }>(`/users/${id}/suspend`, {
      method: 'POST',
    });
  }

  async deleteUser(id: number) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;