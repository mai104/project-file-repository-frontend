import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  DocumentIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { fetchProjectById, deleteProject } from '../store/projectSlice';
import { fetchFiles } from '../store/fileSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MilestoneList from '../components/milestones/MilestoneList';
import FileList from '../components/files/FileList';
import FileUpload from '../components/files/FileUpload';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import ConfirmModal from '../components/common/ConfirmModal';
import moment from 'moment';
import { toast } from 'react-toastify';

const ProjectDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProject, isLoading: projectLoading } = useSelector(state => state.projects);
  const { files, isLoading: filesLoading } = useSelector(state => state.files);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchFiles({ projectId: id }));
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success(t('projects.deleteSuccess'));
      navigate('/projects');
    } catch (error) {
      toast.error(t('projects.deleteError'));
    }
  };

  if (projectLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('projects.projectNotFound')}
        </h1>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 btn-primary"
        >
          {t('projects.backToProjects')}
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('projects.overview') },
    { id: 'files', label: t('projects.files') },
    { id: 'milestones', label: t('projects.milestones') },
    { id: 'reviews', label: t('projects.reviews') },
    { id: 'team', label: t('projects.team') },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('projects.backToProjects')}
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentProject.projectName}
            </h1>
            <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentProject.status)}`}>
              {t(`projects.${currentProject.status.toLowerCase()}`)}
            </span>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {currentProject.shortDescription}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="btn-outline flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            {t('common.edit')}
          </button>
          {user?.role === 'SUPERVISOR' && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-outline text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              {t('common.delete')}
            </button>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('projects.duration')}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {moment(currentProject.startDate).format('MMM D, YYYY')} - {moment(currentProject.endDate).format('MMM D, YYYY')}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('projects.team')}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentProject.team?.members?.length || 0} {t('projects.members')}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('projects.files')}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {files.length} {t('projects.files')}
              </p>
            </div>
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
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('projects.description')}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {currentProject.description || currentProject.shortDescription}
                </p>
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('projects.recentActivity')}
                </h2>
                {/* TODO: Implement activity timeline */}
                <p className="text-gray-500 dark:text-gray-400">{t('projects.noActivity')}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('projects.progress')}
                </h2>
                {/* TODO: Implement progress stats */}
              </div>
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('projects.supervisor')}
                </h2>
                {currentProject.supervisor ? (
                  <div className="flex items-center">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentProject.supervisor.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentProject.supervisor.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">{t('projects.noSupervisor')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('files.title')}
              </h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('files.uploadFile')}
              </button>
            </div>
            <FileList files={files} isLoading={filesLoading} />
          </div>
        )}

        {activeTab === 'milestones' && (
          <MilestoneList
            milestones={currentProject.milestones || []}
            projectId={currentProject.id}
            isLoading={projectLoading}
            onRefresh={() => dispatch(fetchProjectById(id))}
          />
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {user?.role === 'SUPERVISOR' && (
              <div className="card p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('reviews.addReview')}
                </h2>
                <ReviewForm onSubmit={() => {}} isLoading={false} />
              </div>
            )}
            <ReviewList reviews={currentProject.reviews || []} isLoading={projectLoading} />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('projects.teamMembers')}
            </h2>
            {/* TODO: Implement team members list */}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('projects.deleteProject')}
        message={t('projects.confirmDelete')}
        confirmText={t('common.delete')}
      />

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
              milestoneId={null}
              onUploadComplete={() => {
                setShowUploadModal(false);
                dispatch(fetchFiles({ projectId: id }));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
