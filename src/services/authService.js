import { axiosAuthInstance } from './api';

export const registerUser = async (userData) => {
  try {
    const response = await axiosAuthInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosAuthInstance.post('/login', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axiosAuthInstance.get('/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
