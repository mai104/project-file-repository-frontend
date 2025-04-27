import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  FolderIcon,
  DocumentIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useSelector(state => state.auth);

  const navigation = [
    { name: t('common.dashboard'), icon: HomeIcon, href: '/' },
    { name: t('common.projects'), icon: FolderIcon, href: '/projects' },
    { name: t('files.title'), icon: DocumentIcon, href: '/files' },
    { name: t('milestones.title'), icon: ClockIcon, href: '/milestones' },
  ];

  const adminNavigation = [
    { name: t('users.title'), icon: UsersIcon, href: '/users' },
    { name: t('reports.title'), icon: ChartBarIcon, href: '/reports' },
    { name: t('settings.title'), icon: Cog6ToothIcon, href: '/admin/settings' },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 
        ${isActive 
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
        }`
      }
    >
      <item.icon className="w-5 h-5 mr-3" />
      {item.name}
    </NavLink>
  );

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}

              {user?.role === 'SUPERVISOR' && (
                <>
                  <div className="my-4">
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('sidebar.admin')}
                    </h3>
                  </div>
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </>
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {user?.role === 'SUPERVISOR' ? t('auth.supervisor') : t('auth.student')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
