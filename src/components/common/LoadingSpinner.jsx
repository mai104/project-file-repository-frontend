import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
