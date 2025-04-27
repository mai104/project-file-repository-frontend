import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { login } from '../../store/authSlice';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('auth.invalidEmail'))
      .required(t('auth.emailRequired')),
    password: Yup.string()
      .min(8, t('auth.passwordLength'))
      .required(t('auth.passwordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(login(values)).unwrap();
        toast.success(t('auth.loginSuccess'));
        navigate('/');
      } catch (err) {
        toast.error(err || t('auth.loginError'));
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.loginTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.register')}
            </Link>
          </p>
        </div>

        {/* Dev Login Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Development Login Credentials:
          </h3>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <p><strong>Student:</strong> student@test.com / password123</p>
            <p><strong>Supervisor:</strong> supervisor@test.com / password123</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">{t('auth.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-10 ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.email')}
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field pl-10 pr-10 ${
                    formik.touched.password && formik.errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.password')}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...formik.getFieldProps('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                {t('auth.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                t('common.login')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
