import React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';
import OrderHistory from './OrderHistory';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box mt="4em" p={2}>
      <Tabs isFitted variant="enclosed" isLazy lazyBehavior="unmount">
        <TabList mb="2em">
          <Tab>{t('user.tabProfile')}</Tab>
          <Tab>{t('user.tabOrders')}</Tab>
          <Tab>{t('user.tabOrderHistory')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserProfile />
            <Button mt={4} colorScheme="teal" onClick={() => logout(navigate)}>
              {t('user.logout')}
            </Button>
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
