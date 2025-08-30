import axios from 'axios';

const getBaseURL = () => {

  if (import.meta.env.PROD) {
    return 'https://clinix-server.vercel.app';
  }

  return 'http://localhost:4000';
};

const createPatientApi = () => {
  const token = localStorage.getItem('doctorToken');

  const instance = axios.create({
    baseURL: getBaseURL(),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });


  return instance;
};


const createAuthApi = () => {
  const instance = axios.create({
    baseURL: getBaseURL(),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};


const patientApi = createPatientApi();
const authApi = createAuthApi();

export default patientApi;
export { authApi };

// Also export the factory functions for cases where you need a fresh instance
export { createPatientApi, createAuthApi };
