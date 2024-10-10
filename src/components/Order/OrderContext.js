// src/components/Order/OrderProvider.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState(() => {
    try {
      const items = localStorage.getItem('orderItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse order items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);

  const updateOrderItems = useCallback((items) => {
    setOrderItems(items);
  }, []);

  return (
    <OrderContext.Provider value={{ orderItems, updateOrderItems }}>
      {children}
    </OrderContext.Provider>
  );
};
