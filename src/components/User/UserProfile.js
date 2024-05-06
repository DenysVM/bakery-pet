import React from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <FormControl>
        <FormLabel>{t('user.name')}</FormLabel>
        <Input placeholder={t('user.name')} />
        <FormLabel>{t('user.email')}</FormLabel>
        <Input placeholder={t('user.email')} type="email" />
        <Button mt={4} colorScheme="blue">{t('user.saveChanges')}</Button>
      </FormControl>
    </Box>
  );
};

export default UserProfile;
