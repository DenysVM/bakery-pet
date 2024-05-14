import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Required'),
    }),
    onSubmit: (values) => {
        axios.post('http://localhost:5000/users', values)
        .then(response => {
          console.log('User registered:', response.data);
          navigate('/login'); // Переадресация на страницу входа
        })
        .catch(error => {
          console.error('There was an error registering the user:', error);
        });
    }
  });

  return (
    <Box p={4}>
      <form onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={formik.errors.name && formik.touched.name}>
          <FormLabel htmlFor='name'>Name</FormLabel>
          <Input id='name' type='text' {...formik.getFieldProps('name')} />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
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
        <Button mt={4} colorScheme='teal' type='submit'>Register</Button>
      </form>
    </Box>
  );
};

export default SignupForm;
