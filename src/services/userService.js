import { axiosUserInstance } from './api';

export const getUser = async (userId, token) => {
  try {
    const response = await axiosUserInstance.get(`/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (token) => {
  try {
    const response = await axiosUserInstance.get('/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, data, token) => {
  if (!userId || !data || !token) {
    throw new Error("Missing required parameters: userId, data, or token.");
  }

  try {
    const response = await axiosUserInstance.put(`/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw new Error(
      error.response?.data?.message || "Failed to update user profile."
    );
  }
};


export const deleteUser = async (userId, token) => {
  try {
    const response = await axiosUserInstance.delete(`/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
