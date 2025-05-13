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
      .min(3, t('validation.nameMin', { min: 3 }))
      .required(t('auth.nameRequired')),
    email: Yup.string()
      .email(t('auth.invalidEmail'))
      .required(t('auth.emailRequired')),
    password: Yup.string()
      .min(6, t('auth.passwordLength'))
      .required(t('auth.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.passwordMismatch'))
      .required(t('auth.passwordRequired')),
    role: Yup.string()
      .oneOf(['STUDENT', 'SUPERVISOR'], t('auth.invalidRole'))
      .required(t('auth.selectRole')),
    studentId: Yup.string()
      .test({
        name: 'conditionalRequired',
        test: function(value, context) {
          return context.parent.role !== 'STUDENT' || !!value || this.createError({ message: t('auth.studentIdRequired') });
        }
      })
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              {t('common.login')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 rtl:text-right">
                {t('auth.name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`block w-full pl-10 rtl:pl-4 rtl:pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    formik.touched.name && formik.errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.name')}
                  {...formik.getFieldProps('name')}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 rtl:text-right">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 rtl:pl-4 rtl:pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 rtl:text-right">
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
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.role}</p>
              )}
            </div>

            {/* Student ID Field (conditional) */}
            {formik.values.role === 'STUDENT' && (
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 rtl:text-right">
                  {t('auth.studentId')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    className={`block w-full pl-10 rtl:pl-4 rtl:pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formik.touched.studentId && formik.errors.studentId 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : ''
                    }`}
                    placeholder={t('auth.studentId')}
                    {...formik.getFieldProps('studentId')}
                  />
                </div>
                {formik.touched.studentId && formik.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.studentId}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 rtl:text-right">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 rtl:pl-10 rtl:pr-10 pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    formik.touched.password && formik.errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.passwordPlaceholder')}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 rtl:right-auto rtl:left-0 rtl:pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 rtl:text-right">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 rtl:pl-10 rtl:pr-10 pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder={t('auth.confirmPassword')}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 rtl:right-auto rtl:left-0 rtl:pl-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 rtl:text-right">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors
                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 rtl:ml-3 rtl:mr-0 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.loading')}
                </>
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