import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  IdentificationIcon,
  EyeIcon, 
  EyeSlashIcon,
  AcademicCapIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { register } from '../../store/authSlice';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.nameMin'))
      .required(t('auth.nameRequired')),
    email: Yup.string()
      .email(t('auth.invalidEmail'))
      .required(t('auth.emailRequired')),
    password: Yup.string()
      .min(8, t('auth.passwordLength'))
      .required(t('auth.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.passwordMismatch'))
      .required(t('auth.confirmPasswordRequired')),
    role: Yup.string()
      .oneOf(['STUDENT', 'SUPERVISOR'], t('auth.invalidRole'))
      .required(t('auth.roleRequired')),
    studentId: Yup.string().when('role', {
      is: 'STUDENT',
      then: Yup.string().required(t('auth.studentIdRequired')),
      otherwise: Yup.string(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      studentId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(register(values)).unwrap();
        toast.success(t('auth.registerSuccess'));
        navigate('/');
      } catch (err) {
        toast.error(err || t('auth.registerError'));
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.login')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">{t('auth.name')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`input-field pl-10 ${
                    formik.touched.name && formik.errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.name')}
                  {...formik.getFieldProps('name')}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

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

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.accountType')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('role', 'STUDENT')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors
                    ${formik.values.role === 'STUDENT' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <AcademicCapIcon className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">{t('auth.student')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('role', 'SUPERVISOR')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors
                    ${formik.values.role === 'SUPERVISOR' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <UserGroupIcon className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">{t('auth.supervisor')}</span>
                </button>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p>
              )}
            </div>

            {/* Student ID Field (conditional) */}
            {formik.values.role === 'STUDENT' && (
              <div>
                <label htmlFor="studentId" className="sr-only">{t('auth.studentId')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    className={`input-field pl-10 ${
                      formik.touched.studentId && formik.errors.studentId 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : ''
                    }`}
                    placeholder={t('auth.studentId')}
                    {...formik.getFieldProps('studentId')}
                  />
                </div>
                {formik.touched.studentId && formik.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.studentId}</p>
                )}
              </div>
            )}

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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.confirmPassword')}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
              )}
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
                t('common.register')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
