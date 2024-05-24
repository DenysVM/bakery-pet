import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, VStack } from '@chakra-ui/react';

const AuthFields = ({ formik, t, bg, color, hoverBg, focusBorderColor }) => (
  <VStack spacing={4} width="100%">
    <FormControl isInvalid={formik.errors.email && formik.touched.email}>
      <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
      <Input
        id='email'
        type='email'
        placeholder={t('auth.emailPlaceholder')}
        {...formik.getFieldProps('email')}
        bg={bg}
        color={color}
        _hover={{ bg: hoverBg }}
        _focus={{ borderColor: focusBorderColor }}
        autoComplete="email"
      />
      <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
    </FormControl>
    <FormControl isInvalid={formik.errors.password && formik.touched.password}>
      <FormLabel htmlFor='password'>{t('auth.password')}</FormLabel>
      <Input
        id='password'
        type='password'
        placeholder={t('auth.passwordPlaceholder')}
        {...formik.getFieldProps('password')}
        bg={bg}
        color={color}
        _hover={{ bg: hoverBg }}
        _focus={{ borderColor: focusBorderColor }}
        autoComplete="new-password"
      />
      <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
    </FormControl>
  </VStack>
);

export default AuthFields;
