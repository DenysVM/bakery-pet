import React from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
    useColorModeValue
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const langAbbreviation = currentLanguage.toUpperCase().substring(0, 2);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };


    const buttonColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.08)');

    return (
        <Menu>
            <MenuButton
                as={Box}
                aria-label="Select language"
                size="sm"
                bgColor={buttonColor}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                width="40px"
                height="40px"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                marginRight="1rem"
            >
                {langAbbreviation}
            </MenuButton>

            <MenuList>
                <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                <MenuItem onClick={() => changeLanguage('ru')}>Русский</MenuItem>
                <MenuItem onClick={() => changeLanguage('uk')}>Українська</MenuItem>
                <MenuItem onClick={() => changeLanguage('pl')}>Polski</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default LanguageSelector;
