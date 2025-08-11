import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup.string().trim().email('Invalid email format').required('Email is required'),
  password: yup.string().trim().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).noUnknown(true, 'Unknown field in input');

export default loginSchema;
