import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

const SignupForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: {
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        city: ''
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('auth.required')),
      lastName: Yup.string().required(t('auth.required')),
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
      password: Yup.string().min(8, t('auth.passwordMin')).required(t('auth.required')),
      phone: Yup.string().matches(/^\d{10}$/, t('auth.invalidPhone')).required(t('auth.required')),
      address: Yup.object().shape({
        street: Yup.string().required(t('auth.required')),
        houseNumber: Yup.string().required(t('auth.required')),
        apartmentNumber: Yup.string().required(t('auth.required')),
        city: Yup.string().required(t('auth.required'))
      }),
    }),
    onSubmit: async (values) => {
      try {
        const data = await registerUser(values);
        login(data); // Вызов login после регистрации
        toast({
          title: t('auth.registrationSuccess'),
          description: t('auth.registrationSuccessMessage'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/account');
      } catch (error) {
        toast({
          title: t('auth.registrationError'),
          description: error.response?.data?.message || t('auth.registrationErrorMessage'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
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
          <FormControl isInvalid={formik.errors.address?.houseNumber && formik.touched.address?.houseNumber}>
            <FormLabel htmlFor='houseNumber'>{t('auth.address.houseNumber')}</FormLabel>
            <Input
              id='houseNumber'
              type='text'
              placeholder={t('auth.addressPlaceholder.houseNumber')}
              {...formik.getFieldProps('address.houseNumber')}
            />
            <FormErrorMessage>{formik.errors.address?.houseNumber}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address?.apartmentNumber && formik.touched.address?.apartmentNumber}>
            <FormLabel htmlFor='apartmentNumber'>{t('auth.address.apartmentNumber')}</FormLabel>
            <Input
              id='apartmentNumber'
              type='text'
              placeholder={t('auth.addressPlaceholder.apartmentNumber')}
              {...formik.getFieldProps('address.apartmentNumber')}
            />
            <FormErrorMessage>{formik.errors.address?.apartmentNumber}</FormErrorMessage>
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
          <Button mt={4} colorScheme='teal' type='submit' width="full">{t('auth.register')}</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupForm;
