import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { OrderList } from './Orders';
import { ProductList } from './Products';
import { UserList } from './Users';
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  return (
    <Tabs variant="enclosed" isFitted>
      <TabList>
        <Tab>{t('user.tabOrders')}</Tab>
        <Tab>{t('products')}</Tab>
        <Tab>{t('users')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <OrderList />
        </TabPanel>
        <TabPanel>
          <ProductList />
        </TabPanel>
        <TabPanel>
          <UserList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default AdminDashboard;
