// src/auth/LoginForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Text, Link, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { loginUser } from '../services/authService';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
      password: Yup.string().required(t('auth.required')),
    }),
    onSubmit: async (values) => {
      try {
        const data = await loginUser(values);
        login(data);
        navigate('/account');
      } catch (error) {
        console.error('Error logging in:', error);
        alert(t('auth.invalidCredentials'));
      }
    },
  });

  return (
    <Box p={4} mt="4em" maxW="md" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="lg">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={formik.errors.email && formik.touched.email}>
            <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
            <Input
              id='email'
              type='email'
              placeholder={t('auth.emailPlaceholder')}
              {...formik.getFieldProps('email')}
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
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme='teal' type='submit' width="full">{t('auth.login')}</Button>
        </VStack>
      </form>
      <Text mt={4}>
        {t('auth.loginPrompt')} <Link color='teal.500' onClick={() => navigate('/signup')}>{t('auth.register')}</Link>
      </Text>
    </Box>
  );
};

export default LoginForm;
