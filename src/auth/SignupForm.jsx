import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  VStack,
  useToast,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import PhoneInputField from './SignupFields/PhoneInputField';
import AddressFields from './SignupFields/AddressFields';
import NameFields from './SignupFields/NameFields';
import AuthFields from './SignupFields/AuthFields';
import '../styles/SignupForm.css';

const useCustomFormik = (initialValues, validationSchema, onSubmit) => {
  return useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
};

const SignupForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { login } = useAuth();
  const { colorMode } = useColorMode();
  const inputBg = useColorModeValue('#ffffff', '#1a202c');
  const inputTextColor = useColorModeValue('#000000', '#ffffff');
  const inputHoverBg = useColorModeValue('#f7fafc', '#2d3748');
  const activeBorderColor = useColorModeValue('#4299e1', '#63b3ed');

  const formik = useCustomFormik({
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
  Yup.object({
    firstName: Yup.string().required(t('auth.required')),
    lastName: Yup.string().required(t('auth.required')),
    email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
    password: Yup.string().min(8, t('auth.passwordMin')).required(t('auth.required')),
    phone: Yup.string().required(t('auth.required')),
    address: Yup.object().shape({
      street: Yup.string().required(t('auth.required')),
      houseNumber: Yup.string().required(t('auth.required')),
      apartmentNumber: Yup.string().required(t('auth.required')),
      city: Yup.string().required(t('auth.required'))
    }),
  }), 
  async (values) => {
    try {
      const data = await registerUser(values);
      login(data);
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
  });

  const commonProps = {
    formik,
    t,
    bg: inputBg,
    color: inputTextColor,
    hoverBg: inputHoverBg,
    focusBorderColor: activeBorderColor,
  };

  return (
    <Box className={`signup-form-container ${colorMode === 'dark' ? 'dark-theme' : ''}`}>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={3}>
          <NameFields {...commonProps} />
          <AuthFields {...commonProps} />
          <PhoneInputField {...commonProps} />
          <AddressFields {...commonProps} />
          <Button mt={3} colorScheme='teal' type='submit' width="full">
            {t('auth.register')}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupForm;
