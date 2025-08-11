import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import registerSchema from '../../validators/registerSchema';
import { actionRegister } from '../../api/auth';
import useAuthStore from '../../store/auth-store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDocumentTitle from '../../utils/useDocumentTitle';

function Register() {
  useDocumentTitle('Create Account');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const actionLoginWithZustand = useAuthStore((state) => state.actionLoginWithZustand);

  const onSubmit = async (data) => {
    // Remove username if blank so backend can generate it
    const payload = { ...data };
    if (!payload.username || payload.username.trim() === "") {
      delete payload.username;
    }
    try {
      const response = await actionRegister(payload);
      toast.success(response.data.message || 'Registration successful!');
      // Immediately log in after successful registration
      await actionLoginWithZustand({ email: payload.email, password: payload.password });
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-sm bg-base-300 border border-gray-300 shadow-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-center text-white">Register</h2>
          <div className="form-control">
            <label className="label">Username</label>
            <input type="text" className="input input-bordered" {...register('username')} />
            {errors.username && <span className="text-error text-sm">{errors.username.message}</span>}
          </div>
          <div className="form-control">
            <label className="label">Email</label>
            <input type="text" className="input input-bordered" {...register('email')} required />
            {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
          </div>
          <div className="form-control">
            <label className="label">Password</label>
            <input type="password" className="input input-bordered" {...register('password')} required />
            {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
          </div>
          <div className="form-control">
            <label className="label">Confirm Password</label>
            <input type="password" className="input input-bordered" {...register('confirmPassword')} required />
            {errors.confirmPassword && <span className="text-error text-sm">{errors.confirmPassword.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>Register</button>
          <div className="text-center mt-4">
            <span>Already have an account? </span>
            <a href="/login" className="link link-primary">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
