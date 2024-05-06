import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { OrderHistory, UserOrders, UserProfile } from '../components/User';

const AccountPage = () => {
  const { t } = useTranslation();
  
  return (
    <Box p={4}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>{t('user.tabProfile')}</Tab>
          <Tab>{t('user.tabOrders')}</Tab>
          <Tab>{t('user.tabOrderHistory')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserProfile />
          </TabPanel>
          <TabPanel>
            <UserOrders />
          </TabPanel>
          <TabPanel>
            <OrderHistory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AccountPage;