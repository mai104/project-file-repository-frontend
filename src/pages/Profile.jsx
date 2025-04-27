import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);

  // Personal Info Form
  const personalInfoForm = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      studentId: user?.studentId || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('auth.nameRequired')),
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.emailRequired')),
      studentId: user?.role === 'STUDENT' ? Yup.string().required(t('auth.studentIdRequired')) : Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await authService.updateProfile(values);
        toast.success(t('profile.updateSuccess'));
      } catch (error) {
        toast.error(t('profile.updateError'));
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Password Change Form
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(t('profile.currentPasswordRequired')),
      newPassword: Yup.string()
        .min(8, t('auth.passwordLength'))
        .required(t('profile.newPasswordRequired')),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], t('auth.passwordMismatch'))
        .required(t('profile.confirmPasswordRequired')),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await authService.changePassword(values);
        toast.success(t('profile.passwordChanged'));
        resetForm();
      } catch (error) {
        toast.error(t('profile.passwordError'));
      } finally {
        setIsLoading(false);
      }
    },
  });

  const tabs = [
    { id: 'personal', label: t('profile.personalInfo'), icon: UserCircleIcon },
    { id: 'security', label: t('profile.accountSettings'), icon: KeyIcon },
    { id: 'preferences', label: t('profile.preferences'), icon: BellIcon },
  ];

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement avatar upload
      toast.info(t('profile.avatarUploadTODO'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-24 w-24 text-gray-400" />
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full text-white cursor-pointer hover:bg-primary-700 transition-colors"
            >
              <CameraIcon className="h-5 w-5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium mt-2 
              ${user?.role === 'SUPERVISOR' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}
            >
              {t(`auth.${user?.role?.toLowerCase()}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card p-6">
        {activeTab === 'personal' && (
          <form onSubmit={personalInfoForm.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.name')}
              </label>
              <input
                id="name"
                type="text"
                {...personalInfoForm.getFieldProps('name')}
                className={`mt-1 input-field ${
                  personalInfoForm.touched.name && personalInfoForm.errors.name 
                    ? 'border-red-500' 
                    : ''
                }`}
              />
              {personalInfoForm.touched.name && personalInfoForm.errors.name && (
                <p className="mt-1 text-sm text-red-600">{personalInfoForm.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                {...personalInfoForm.getFieldProps('email')}
                className={`mt-1 input-field ${
                  personalInfoForm.touched.email && personalInfoForm.errors.email 
                    ? 'border-red-500' 
                    : ''
                }`}
              />
              {personalInfoForm.touched.email && personalInfoForm.errors.email && (
                <p className="mt-1 text-sm text-red-600">{personalInfoForm.errors.email}</p>
              )}
            </div>

            {user?.role === 'STUDENT' && (
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.studentId')}
                </label>
                <input
                  id="studentId"
                  type="text"
                  {...personalInfoForm.getFieldProps('studentId')}
                  className={`mt-1 input-field ${
                    personalInfoForm.touched.studentId && personalInfoForm.errors.studentId 
                      ? 'border-red-500' 
                      : ''
                  }`}
                />
                {personalInfoForm.touched.studentId && personalInfoForm.errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{personalInfoForm.errors.studentId}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.currentPassword')}
              </label>
              <input
                id="currentPassword"
                type="password"
                {...passwordForm.getFieldProps('currentPassword')}
                className={`mt-1 input-field ${
                  passwordForm.touched.currentPassword && passwordForm.errors.currentPassword 
                    ? 'border-red-500' 
                    : ''
                }`}
              />
              {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.newPassword')}
              </label>
              <input
                id="newPassword"
                type="password"
                {...passwordForm.getFieldProps('newPassword')}
                className={`mt-1 input-field ${
                  passwordForm.touched.newPassword && passwordForm.errors.newPassword 
                    ? 'border-red-500' 
                    : ''
                }`}
              />
              {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.confirmNewPassword')}
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                {...passwordForm.getFieldProps('confirmNewPassword')}
                className={`mt-1 input-field ${
                  passwordForm.touched.confirmNewPassword && passwordForm.errors.confirmNewPassword 
                    ? 'border-red-500' 
                    : ''
                }`}
              />
              {passwordForm.touched.confirmNewPassword && passwordForm.errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.confirmNewPassword}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? t('common.saving') : t('profile.changePassword')}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('profile.theme')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.themeDescription')}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700"
              >
                <span
                  className={`${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                >
                  {isDark ? (
                    <MoonIcon className="h-5 w-5 text-gray-700" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('profile.language')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.languageDescription')}
                </p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field w-32"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('profile.emailNotifications')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.emailNotificationsDescription')}
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 bg-primary-600">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
