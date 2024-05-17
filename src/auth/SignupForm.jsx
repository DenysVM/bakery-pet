// src/auth/SignupForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useTranslation } from 'react-i18next';

const SignupForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('auth.required')),
      lastName: Yup.string().required(t('auth.required')),
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
      password: Yup.string().min(8, t('auth.passwordMin')).required(t('auth.required')),
      phone: Yup.string().required(t('auth.required')),
      address: Yup.object().shape({
        street: Yup.string().required(t('auth.required')),
        city: Yup.string().required(t('auth.required')),
        state: Yup.string().required(t('auth.required')),
        zip: Yup.string().required(t('auth.required'))
      }),
    }),
    onSubmit: async (values) => {
      try {
        const data = await registerUser(values);
        console.log('User registered:', data);
        navigate('/login');
      } catch (error) {
        console.error('There was an error registering the user:', error);
      }
    }
  });

  return (
    <Box p={4} mt="4em" maxW="md" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="lg">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={formik.errors.firstName && formik.touched.firstName}>
            <FormLabel htmlFor='firstName'>{t('auth.firstName')}</FormLabel>
            <Input
              id='firstName'
              type='text'
              placeholder={t('auth.firstNamePlaceholder')}
              {...formik.getFieldProps('firstName')}
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
            />
            <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
          </FormControl>
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
          <FormControl isInvalid={formik.errors.phone && formik.touched.phone}>
            <FormLabel htmlFor='phone'>{t('auth.phone')}</FormLabel>
            <Input
              id='phone'
              type='text'
              placeholder={t('auth.phonePlaceholder')}
              {...formik.getFieldProps('phone')}
            />
            <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address?.street && formik.touched.address?.street}>
            <FormLabel htmlFor='street'>{t('auth.address.street')}</FormLabel>
            <Input
              id='street'
              type='text'
              placeholder={t('auth.addressPlaceholder.street')}
              {...formik.getFieldProps('address.street')}
            />
            <FormErrorMessage>{formik.errors.address?.street}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address?.city && formik.touched.address?.city}>
            <FormLabel htmlFor='city'>{t('auth.address.city')}</FormLabel>
            <Input
              id='city'
              type='text'
              placeholder={t('auth.addressPlaceholder.city')}
              {...formik.getFieldProps('address.city')}
            />
            <FormErrorMessage>{formik.errors.address?.city}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address?.state && formik.touched.address?.state}>
            <FormLabel htmlFor='state'>{t('auth.address.state')}</FormLabel>
            <Input
              id='state'
              type='text'
              placeholder={t('auth.addressPlaceholder.state')}
              {...formik.getFieldProps('address.state')}
            />
            <FormErrorMessage>{formik.errors.address?.state}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address?.zip && formik.touched.address?.zip}>
            <FormLabel htmlFor='zip'>{t('auth.address.zip')}</FormLabel>
            <Input
              id='zip'
              type='text'
              placeholder={t('auth.addressPlaceholder.zip')}
              {...formik.getFieldProps('address.zip')}
            />
            <FormErrorMessage>{formik.errors.address?.zip}</FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme='teal' type='submit' width="full">{t('auth.register')}</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupForm;
