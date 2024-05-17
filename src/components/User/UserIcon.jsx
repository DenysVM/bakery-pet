// src/components/UserIcon.jsx
import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { MdAccountCircle } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';

const UserIcon = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <IconButton
      as={RouterLink}
      to={isAuthenticated ? "/account" : "/auth"}
      icon={<MdAccountCircle size="24px" />}
      isRound='true'
      aria-label={t('account')}
      ref={ref} 
      {...props}
    />
  );
});

export default UserIcon;
