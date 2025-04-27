import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon, 
  TrashIcon, 
  PencilIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { deleteFile, fetchFiles } from '../../store/fileSlice';
import fileService from '../../services/fileService';
import { toast } from 'react-toastify';
import moment from 'moment';
import ConfirmModal from '../common/ConfirmModal';

const FileList = ({ files, isLoading, onRefresh }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDownload = async (fileId, fileName) => {
    try {
      await fileService.downloadFile(fileId);
      toast.success(t('files.downloadSuccess'));
    } catch (error) {
      toast.error(t('files.downloadError'));
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFile(deleteFileId)).unwrap();
      toast.success(t('files.deleteSuccess'));
      setShowDeleteModal(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(t('files.deleteError'));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('powerpoint')) return '📽️';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📁';
  };

  // Filter and sort files
  const filteredFiles = files
    .filter(file => 
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.fileName.localeCompare(b.fileName)
          : b.fileName.localeCompare(a.fileName);
      }
      if (sortBy === 'size') {
        return sortOrder === 'asc' 
          ? a.fileSize - b.fileSize
          : b.fileSize - a.fileSize;
      }
      if (sortBy === 'uploadDate') {
        return sortOrder === 'asc' 
          ? new Date(a.uploadDate) - new Date(b.uploadDate)
          : new Date(b.uploadDate) - new Date(a.uploadDate);
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('files.searchFiles')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="uploadDate">{t('files.uploadDate')}</option>
            <option value="name">{t('files.fileName')}</option>
            <option value="size">{t('files.fileSize')}</option>
          </select>
          
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="btn-outline"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* File List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('files.noFiles')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery ? t('files.noMatchingFiles') : t('files.getStarted')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFiles.map((file) => (
            <div 
              key={file.id}
              className="card p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {file.fileName}
                    </h3>
                    {file.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {file.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {file.uploadedBy?.name}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {moment(file.uploadDate).format('MMM D, YYYY HH:mm')}
                      </div>
                      <div>
                        {formatFileSize(file.fileSize)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file.id, file.fileName)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                    title={t('files.downloadFile')}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* TODO: Implement edit */}}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                    title={t('common.edit')}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteFileId(file.id);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title={t('common.delete')}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title={t('files.deleteFile')}
          message={t('files.confirmDelete')}
          confirmText={t('common.delete')}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default FileList;
