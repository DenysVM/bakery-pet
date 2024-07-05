import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const updateOrderItems = (items) => {
    setOrderItems(items);
  };

  return (
    <OrderContext.Provider value={{ orderItems, updateOrderItems }}>
      {children}
    </OrderContext.Provider>
  );
};
