import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import FileUpload from '../components/files/FileUpload';
import FileList from '../components/files/FileList';
import { fetchFiles } from '../store/fileSlice';

const FilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { files, isLoading } = useSelector(state => state.files);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    dispatch(fetchFiles({}));
  }, [dispatch]);

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    dispatch(fetchFiles({}));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('files.title')}
        </h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('files.uploadFile')}
        </button>
      </div>

      <FileList files={files} isLoading={isLoading} onRefresh={() => dispatch(fetchFiles({}))} />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('files.uploadFile')}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <FileUpload
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePage;
