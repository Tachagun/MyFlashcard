import * as yup from 'yup';


const registerSchema = yup.object().shape({
  username: yup.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .notRequired()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default registerSchema;
