// src/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Text, Link, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { loginUser } from '../services/authService';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
      password: Yup.string().required(t('auth.required')),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await loginUser(values);
        if (data) {
          login(data);
          navigate('/account');
        } else {
          toast({
            title: t('auth.loginError'),
            description: t('auth.userNotFound'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: t('auth.loginError'),
          description: t('auth.invalidCredentials'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error logging in:', error);
      } finally {
        setIsLoading(false);
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
              autoComplete="password"
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme='teal' type='submit' width="full" isLoading={isLoading}>
            {t('auth.login')}
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        {t('auth.loginPrompt')} <Link color='teal.500' onClick={() => navigate('/signup')}>{t('auth.register')}</Link>
      </Text>
    </Box>
  );
};

export default LoginForm;
