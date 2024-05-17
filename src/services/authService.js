// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bakery-pet-backend.onrender.com/api/auth'
  : 'http://localhost:5000/api/auth';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/login', userData);
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await axiosInstance.get('/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};
