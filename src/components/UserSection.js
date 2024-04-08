import React from 'react';
import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const UserSection = () => {
    const { t } = useTranslation();
    const buttonColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.08)');
    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<Avatar size="sm" bgColor={buttonColor}
            />}>
                {t('account')}
            </MenuButton>
            <MenuList>
                <MenuItem as={RouterLink} to="/account">{t('account')}</MenuItem>
                <MenuItem as={RouterLink} to="/cart">{t('cart')}</MenuItem>
                <MenuItem>{t('logout')}</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default UserSection;
