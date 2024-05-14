import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      fetch(`${process.env.PUBLIC_URL}/users.json`)
        .then(response => response.json())
        .then(data => {
          const user = data.users.find(u => u.email === values.email && u.password === values.password);
          if (user) {
            console.log('Login successful:', user);
            login(); 
            navigate('/account'); 
          } else {
            alert('Invalid credentials');
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
  });

  return (
    <Box p={4} mt="4em">
      <form onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={formik.errors.email && formik.touched.email}>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input id='email' type='email' {...formik.getFieldProps('email')} />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={formik.errors.password && formik.touched.password}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input id='password' type='password' {...formik.getFieldProps('password')} />
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>
        <Button mt={4} colorScheme='teal' type='submit'>Войти</Button>
      </form>
    </Box>
  );    
};

export default LoginForm;
