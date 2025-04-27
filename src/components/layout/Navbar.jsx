import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { 
  BellIcon, 
  MoonIcon, 
  SunIcon, 
  GlobeAltIcon,
  UserCircleIcon,
  ChevronDownIcon,
  HomeIcon,
  FolderIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: t('common.dashboard'), href: '/', icon: HomeIcon },
    { name: t('common.projects'), href: '/projects', icon: FolderIcon },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                  {t('common.appName')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700
                    dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 
                dark:hover:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 
                dark:hover:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                flex items-center"
              aria-label="Toggle language"
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 
                dark:hover:text-white relative transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 
                  text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 
                  bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center text-sm rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.name}
                  </span>
                  <ChevronDownIcon className="hidden md:block h-4 w-4 text-gray-500" />
                </div>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 
                  bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3" />
                        {t('common.profile')}
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-3" />
                        {t('common.settings')}
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        {t('common.logout')}
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 
                hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 border-l-4 text-base font-medium
                border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 
                hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 
                dark:hover:text-white transition-colors duration-200"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <UserCircleIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name}</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 
                hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {t('common.profile')}
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 
                hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {t('common.settings')}
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 
                hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white 
                dark:hover:bg-gray-700"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
