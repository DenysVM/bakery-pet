import axios from 'axios';

const AUTH_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bakery-pet-backend.onrender.com/api/auth'
  : 'http://localhost:5000/api/auth';

const ORDER_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://bakery-pet-backend.onrender.com/api/orders'
  : 'http://localhost:5000/api/orders';

  const PRODUCT_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://bakery-pet-backend.onrender.com/api/products'
  : 'http://localhost:5000/api/products';


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

