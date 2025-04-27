import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { uploadFile } from '../../store/fileSlice';
import { toast } from 'react-toastify';

const FileUpload = ({ milestoneId, onUploadComplete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [descriptions, setDescriptions] = useState({});

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Initialize descriptions for new files
    const newDescriptions = {};
    newFiles.forEach(f => {
      newDescriptions[f.id] = '';
    });
    setDescriptions(prev => ({ ...prev, ...newDescriptions }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setDescriptions(prev => {
      const newDesc = { ...prev };
      delete newDesc[fileId];
      return newDesc;
    });
  };

  const handleDescriptionChange = (fileId, value) => {
    setDescriptions(prev => ({
      ...prev,
      [fileId]: value,
    }));
  };

  const uploadFiles = async () => {
    setUploading(true);
    
    try {
      for (const fileItem of files) {
        if (fileItem.status === 'uploaded') continue;

        try {
          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'uploading' }
                : f
            )
          );

          // محاكاة تقدم الرفع
          for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setFiles(prev => 
              prev.map(f => 
                f.id === fileItem.id 
                  ? { ...f, progress: i }
                  : f
              )
            );
          }

          await dispatch(uploadFile({
            file: fileItem.file,
            description: descriptions[fileItem.id],
            milestoneId,
          })).unwrap();

          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'uploaded', progress: 100 }
                : f
            )
          );

          toast.success(`تم رفع ${fileItem.name} بنجاح`);
        } catch (error) {
          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'error' }
                : f
            )
          );
          toast.error(`فشل رفع ${fileItem.name}`);
        }
      }

      if (onUploadComplete) {
        onUploadComplete();
      }

      // Clear successfully uploaded files after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== 'uploaded'));
        setDescriptions({});
      }, 2000);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-400'
          }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isDragActive 
            ? 'أفلت الملفات هنا' 
            : 'اسحب وأفلت الملفات هنا، أو انقر لاختيار الملفات'
          }
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, الصور
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          الحد الأقصى: 10 ميجابايت
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            الملفات المختارة
          </h3>
          <ul className="space-y-3">
            {files.map((fileItem) => (
              <li 
                key={fileItem.id}
                className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {fileItem.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(fileItem.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileItem.status === 'uploaded' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {fileItem.status === 'error' && (
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                    {fileItem.status === 'uploading' && (
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      disabled={fileItem.status === 'uploading'}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Description input */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="وصف الملف (اختياري)"
                    value={descriptions[fileItem.id] || ''}
                    onChange={(e) => handleDescriptionChange(fileItem.id, e.target.value)}
                    className="input-field"
                    disabled={fileItem.status !== 'pending'}
                  />
                </div>
              </li>
            ))}
          </ul>
          
          {/* Upload button */}
          <button
            onClick={uploadFiles}
            disabled={uploading || files.every(f => f.status === 'uploaded')}
            className={`btn-primary w-full flex items-center justify-center
              ${uploading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الرفع...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                رفع الملفات
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
