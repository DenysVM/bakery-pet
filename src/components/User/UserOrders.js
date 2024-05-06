import React from 'react';
import { Box, List, ListItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const UserOrders = () => {
  const { t } = useTranslation();
  const orders = [{ id: 1, product: "Продукт A", status: t('user.currentOrders') }];

  return (
    <Box>
      <List>
        {orders.map(order => (
          <ListItem key={order.id}>
            {order.product} - {order.status}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserOrders;
