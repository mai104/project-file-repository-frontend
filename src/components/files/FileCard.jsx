import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';

const FileCard = ({ file, onDownload, onView }) => {
  const { t } = useTranslation();

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('powerpoint')) return '📽️';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card-hover p-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <span className="text-3xl">{getFileIcon(file.fileType)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {file.fileName}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDownload(file.id, file.fileName)}
                className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                title={t('files.downloadFile')}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {file.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {file.description}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {file.uploadedBy?.name}
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {moment(file.uploadDate).fromNow()}
            </div>
            <div>
              {formatFileSize(file.fileSize)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
