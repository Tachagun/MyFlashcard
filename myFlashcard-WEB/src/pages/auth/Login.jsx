import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../../validators/loginSchema';
import useAuthStore from '../../store/auth-store';
import { getMe } from '../../api/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../utils/useDocumentTitle';

function Login() {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const actionLoginWithZustand = useAuthStore((state) => state.actionLoginWithZustand);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await actionLoginWithZustand(data);
    // console.log(result.role)
    if (result.success) {
      let userRole = result.role;
      // Fetch latest user info (including pfp) after login
      console.log(userRole)
      try {
        const userData = await getMe(useAuthStore.getState().token);
        setUser(userData);
        // userRole = userData.role;
      } catch (e) {
        // fallback: keep user from login response
      }
      toast.success('Login successful!');
      reset();
      // console.log(userRole)
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-sm bg-base-100 shadow-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <div className="form-control">
          <label className="label">Email</label>
          <input type="email" className="input input-bordered" {...register('email')} required />
          {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
        </div>
        <div className="form-control">
          <label className="label">Password</label>
          <input type="password" className="input input-bordered" {...register('password')} required />
          {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>Login</button>
        <div className="text-center mt-4">
          <span>Don't have an account? </span>
          <a href="/register" className="link link-primary">Sign up</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
