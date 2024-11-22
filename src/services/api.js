import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bakery-pet-backend.onrender.com' 
  : `http://${window.location.hostname}:5000`; 

const AUTH_API_URL = `${BASE_URL}/api/auth`;
const ORDER_API_URL = `${BASE_URL}/api/orders`;
const PRODUCT_API_URL = `${BASE_URL}/api/products`;
const USER_API_URL = `${BASE_URL}/api/users`;

export const axiosAuthInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosOrderInstance = axios.create({
  baseURL: ORDER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosProductInstance = axios.create({
  baseURL: PRODUCT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosUserInstance = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
