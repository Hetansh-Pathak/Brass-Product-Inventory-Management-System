import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Check if we're in fallback mode
    if (response.headers['x-fallback-mode']) {
      toast.info('Running in demo mode with sample data', { toastId: 'fallback-mode' });
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
    changePassword: '/auth/change-password',
  },
  
  // Products
  products: {
    list: '/products',
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    get: (id: string) => `/products/${id}`,
    stock: (id: string) => `/products/${id}/stock`,
    lowStock: '/products/low-stock',
    stats: '/products/stats/overview',
  },
  
  // Raw Materials
  materials: {
    list: '/materials',
    create: '/materials',
    update: (id: string) => `/materials/${id}`,
    delete: (id: string) => `/materials/${id}`,
    get: (id: string) => `/materials/${id}`,
    stock: (id: string) => `/materials/${id}/stock`,
    lowStock: '/materials/low-stock',
  },
  
  // Bills
  bills: {
    list: '/billing',
    create: '/billing',
    update: (id: string) => `/billing/${id}`,
    delete: (id: string) => `/billing/${id}`,
    get: (id: string) => `/billing/${id}`,
    pdf: (id: string) => `/billing/${id}/pdf`,
    stats: '/billing/stats',
  },
  
  // Dashboard
  dashboard: {
    overview: '/dashboard/overview',
    stats: '/dashboard/stats', 
    alerts: '/dashboard/alerts',
    charts: '/dashboard/charts',
  },
  
  // Users (admin only)
  users: {
    list: '/auth/users',
    updateStatus: (id: string) => `/auth/users/${id}/status`,
  },
};

// Helper functions for common API patterns
export const apiHelpers = {
  // Generic CRUD operations
  getList: async (endpoint: string, params?: any) => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  
  getById: async (endpoint: string) => {
    const response = await api.get(endpoint);
    return response.data;
  },
  
  create: async (endpoint: string, data: any) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },
  
  update: async (endpoint: string, data: any) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },
  
  delete: async (endpoint: string) => {
    const response = await api.delete(endpoint);
    return response.data;
  },
  
  // File upload
  uploadFile: async (endpoint: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  },
};

export default api;
