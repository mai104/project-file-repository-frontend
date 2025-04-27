import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CalendarIcon, 
  DocumentIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';

const MilestoneCard = ({ milestone, onClick }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('milestones.completed');
      case 'in_progress':
        return t('milestones.inProgress');
      case 'overdue':
        return t('milestones.overdue');
      default:
        return t('milestones.notStarted');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="card-hover p-4 cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getStatusIcon(milestone.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {milestone.milestoneName}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
              {getStatusText(milestone.status)}
            </span>
          </div>
          {milestone.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {milestone.description}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {t('milestones.dueDate')}: {moment(milestone.dueDate).format('MMM D, YYYY')}
            </div>
            {milestone.files && (
              <div className="flex items-center">
                <DocumentIcon className="h-4 w-4 mr-1" />
                {milestone.files.length} {t('files.title')}
              </div>
            )}
          </div>
          {milestone.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-300">{t('milestones.progress')}</span>
                <span className="text-gray-900 dark:text-white font-medium">{milestone.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
