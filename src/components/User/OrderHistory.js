import React from 'react';
import { Box, List, ListItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const OrderHistory = () => {
  const { t } = useTranslation();
  const history = [{ id: 1, product: "Продукт A", status: t('user.deliveredOrders') }];

  return (
    <Box>
      <List>
        {history.map(item => (
          <ListItem key={item.id}>
            {item.product} - {item.status}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OrderHistory;
