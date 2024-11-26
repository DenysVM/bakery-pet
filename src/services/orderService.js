import { axiosOrderInstance } from './api';

const generateOrderNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const uniquePart = Date.now().toString().slice(-4);
  return `ORD-${datePart}-${uniquePart}`;
};

export const createOrder = async (orderData, token, user) => {
  try {
    const orderNumber = generateOrderNumber(); 

    // Включаем данные пользователя в запрос
    const enrichedOrderData = {
      ...orderData,
      orderNumber,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    };

    const response = await axiosOrderInstance.post(
      '/',
      enrichedOrderData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axiosOrderInstance.put(
      `/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error updating order status:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getAllOrders = async (token) => {
  try {
    const response = await axiosOrderInstance.get('/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserOrders = async (token, userId) => {
  try {
    const response = await axiosOrderInstance.get('/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId },
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

export const addItemToOrder = async (orderId, itemData, token) => {
  try {
    const response = await axiosOrderInstance.post(`/${orderId}/items`, itemData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId, token) => {
  try {
    const response = await axiosOrderInstance.get(`/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error.response?.data || error.message);
    throw error;
  }
};

