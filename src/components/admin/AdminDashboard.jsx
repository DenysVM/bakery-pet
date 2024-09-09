import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { OrderList } from './Orders';
import { ProductList } from './Products';
import { UserList } from './Users';

const AdminDashboard = () => {
  return (
    <Tabs variant="enclosed" isFitted>
      <TabList>
        <Tab>Orders</Tab>
        <Tab>Products</Tab>
        <Tab>Users</Tab>
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
