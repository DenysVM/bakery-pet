import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { OrderList } from './Orders';
import { ProductList } from './Products';
import { UserList, UserDetail } from './Users';
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleViewUserDetails = (userId) => setSelectedUserId(userId);
  const handleBackToUserList = () => setSelectedUserId(null); 

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
          {selectedUserId ? (
            <UserDetail
              userId={selectedUserId}
              onBack={handleBackToUserList}
            />
          ) : (
            <UserList onViewDetails={handleViewUserDetails} />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default AdminDashboard;
