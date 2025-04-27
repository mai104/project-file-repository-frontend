import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  FolderIcon,
  CalendarIcon,
  UsersIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { fetchProjects, setFilter, setSearchQuery } from '../store/projectSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import moment from 'moment';

const Projects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projects, isLoading, filter, searchQuery } = useSelector(state => state.projects);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery, dispatch]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && project.status === 'ACTIVE') ||
      (filter === 'completed' && project.status === 'COMPLETED') ||
      (filter === 'pending' && project.status === 'PENDING');

    return matchesSearch && matchesFilter;
  });

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

  const getProjectProgress = (project) => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
    return Math.round((completedMilestones / project.milestones.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('projects.title')}
        </h1>
        <Link
          to="/projects/create"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('projects.createProject')}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('projects.searchProjects')}
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => dispatch(setFilter(e.target.value))}
          className="input-field sm:w-48"
        >
          <option value="all">{t('projects.allProjects')}</option>
          <option value="active">{t('projects.active')}</option>
          <option value="completed">{t('projects.completed')}</option>
          <option value="pending">{t('projects.pending')}</option>
        </select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 card">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('projects.noProjects')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || filter !== 'all' 
              ? t('projects.noMatchingProjects') 
              : t('projects.getStarted')}
          </p>
          {!searchQuery && filter === 'all' && (
            <div className="mt-6">
              <Link
                to="/projects/create"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('projects.createProject')}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card-hover p-6 block"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FolderIcon className="h-8 w-8 text-primary-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {project.projectName}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {t(`projects.${project.status.toLowerCase()}`)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {project.shortDescription}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {moment(project.startDate).format('MMM D, YYYY')} - {moment(project.endDate).format('MMM D, YYYY')}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  {project.team?.members?.length || 0} {t('projects.members')}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <DocumentIcon className="h-4 w-4 mr-2" />
                  {project.files?.length || 0} {t('projects.files')}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-300">{t('projects.progress')}</span>
                  <span className="text-gray-900 dark:text-white font-medium">{getProjectProgress(project)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProjectProgress(project)}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
