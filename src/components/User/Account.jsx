import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { OrderHistory, UserOrders, UserProfile } from '.';

const Account = () => {
  const { t } = useTranslation();
  
  return (
    <Box mt="4em" p={2}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="2em">
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

export default Account;