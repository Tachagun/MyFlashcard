import axios from "./axios"; // use your configured axios instance

export const actionRegister = async (value) => {
  return await axios.post('/api/auth/register', value);
};

export const actionLogin = async (value) => {
  return await axios.post('/api/auth/login', value);
};