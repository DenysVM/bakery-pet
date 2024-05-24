import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, VStack } from '@chakra-ui/react';

const NameFields = ({ formik, t, bg, color, hoverBg, focusBorderColor }) => (
  <VStack spacing={4} width="100%">
    <FormControl isInvalid={formik.errors.firstName && formik.touched.firstName}>
      <FormLabel htmlFor='firstName'>{t('auth.firstName')}</FormLabel>
      <Input
        id='firstName'
        type='text'
        placeholder={t('auth.firstNamePlaceholder')}
        {...formik.getFieldProps('firstName')}
        bg={bg}
        color={color}
        _hover={{ bg: hoverBg }}
        _focus={{ borderColor: focusBorderColor }}
        autoComplete="given-name"
      />
      <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
    </FormControl>
    <FormControl isInvalid={formik.errors.lastName && formik.touched.lastName}>
      <FormLabel htmlFor='lastName'>{t('auth.lastName')}</FormLabel>
      <Input
        id='lastName'
        type='text'
        placeholder={t('auth.lastNamePlaceholder')}
        {...formik.getFieldProps('lastName')}
        bg={bg}
        color={color}
        _hover={{ bg: hoverBg }}
        _focus={{ borderColor: focusBorderColor }}
        autoComplete="family-name"
      />
      <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
    </FormControl>
  </VStack>
);

export default NameFields;
