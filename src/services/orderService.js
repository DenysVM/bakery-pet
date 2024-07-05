import { axiosOrderInstance } from './api';

export const createOrder = async (orderData, token) => {
  try {
    const response = await axiosOrderInstance.post('/', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserOrders = async (token) => {
  try {
    const response = await axiosOrderInstance.get('/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateOrderItem = async (orderId, itemId, itemData, token) => {
  try {
    const response = await axiosOrderInstance.put(`/${orderId}/items/${itemId}`, itemData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order item:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteOrderItem = async (orderId, itemId, token) => {
  try {
    const response = await axiosOrderInstance.delete(`/${orderId}/items/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order item:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteOrder = async (orderId, token) => {
  try {
    const response = await axiosOrderInstance.delete(`/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error.response ? error.response.data : error.message);
    throw error;
  }
};
