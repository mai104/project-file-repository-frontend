import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} {t('common.appName')}. All rights reserved.
            </span>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/about"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white 
                transition-colors duration-200"
            >
              {t('footer.about')}
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white 
                transition-colors duration-200"
            >
              {t('footer.contact')}
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white 
                transition-colors duration-200"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white 
                transition-colors duration-200"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
