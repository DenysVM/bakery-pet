import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { MdAccountCircle } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserSection = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  return (
    <IconButton
      as={RouterLink}
      to="/account"
      icon={<MdAccountCircle size="24px" />}
      isRound='true'
      aria-label={t('account')}
      ref={ref} 
      {...props}
    />
  );
});

export default UserSection;
