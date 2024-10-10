// services/productService.js

import { axiosProductInstance } from './api';

export const getAllProducts = async (productIds = []) => {
  try {
    const params = {};
    if (productIds.length > 0) {
      params.ids = productIds.join(',');
    }
    const response = await axiosProductInstance.get('/', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching products:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axiosProductInstance.get(`/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createProduct = async (productData, token) => {
  try {
    const response = await axiosProductInstance.post('/', productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProduct = async (productId, productData, token) => {
  try {
    const response = await axiosProductInstance.put(`/${productId}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    const response = await axiosProductInstance.delete(`/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
