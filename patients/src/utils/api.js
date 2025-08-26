import axios from 'axios';

// Base URL configuration for different environments
const getBaseURL = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD) {
    return 'https://clinix-server.vercel.app';
  }
  // Default to local development
  return 'http://localhost:4000';
};

// Create axios instance for patients
const createPatientApi = () => {
  const token = localStorage.getItem('patientToken');

  const instance = axios.create({
    baseURL: getBaseURL(),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear local storage and redirect
        localStorage.removeItem('patientToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create axios instance for authentication (without auth header)
const createAuthApi = () => {
  const instance = axios.create({
    baseURL: getBaseURL(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

// Export the configured axios instances
const patientApi = createPatientApi();
const authApi = createAuthApi();

export default patientApi;
export { authApi };

// Also export the factory functions for cases where you need a fresh instance
export { createPatientApi, createAuthApi };
