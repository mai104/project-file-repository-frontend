import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FolderIcon, 
  DocumentIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  BellIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { fetchProjects } from '../store/projectSlice';
import { fetchFiles } from '../store/fileSlice';
import FileCard from '../components/files/FileCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { projects, isLoading: projectsLoading } = useSelector(state => state.projects);
  const { files, isLoading: filesLoading } = useSelector(state => state.files);
  const { notifications } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchFiles({ limit: 5 }));
  }, [dispatch]);

  const stats = [
    {
      name: t('dashboard.totalProjects'),
      value: projects.length,
      icon: FolderIcon,
      color: 'bg-blue-500',
    },
    {
      name: t('dashboard.totalFiles'),
      value: files.length,
      icon: DocumentIcon,
      color: 'bg-green-500',
    },
    {
      name: t('dashboard.completedMilestones'),
      value: projects.reduce((acc, project) => 
        acc + project.milestones?.filter(m => m.status === 'completed').length || 0, 0
      ),
      icon: CheckCircleIcon,
      color: 'bg-yellow-500',
    },
    {
      name: t('dashboard.upcomingDeadlines'),
      value: projects.reduce((acc, project) => 
        acc + project.milestones?.filter(m => 
          m.status !== 'completed' && moment(m.dueDate).isBefore(moment().add(7, 'days'))
        ).length || 0, 0
      ),
      icon: ClockIcon,
      color: 'bg-red-500',
    },
  ];

  const recentFiles = files.slice(0, 5);
  const upcomingDeadlines = projects.flatMap(project => 
    project.milestones?.filter(m => 
      m.status !== 'completed' && moment(m.dueDate).isBefore(moment().add(14, 'days'))
    ).map(m => ({ ...m, projectName: project.projectName })) || []
  ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t('dashboard.welcome')}, {user?.name}!</h1>
        <p className="mt-2 text-primary-100">
          {moment().format('dddd, MMMM D, YYYY')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="card p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('dashboard.recentFiles')}
              </h2>
              <Link to="/files" className="text-sm text-primary-600 hover:text-primary-700">
                {t('dashboard.viewAll')}
              </Link>
            </div>
            {filesLoading ? (
              <LoadingSpinner />
            ) : recentFiles.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">{t('files.noFiles')}</p>
            ) : (
              <div className="space-y-4">
                {recentFiles.map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('dashboard.upcomingDeadlines')}
            </h2>
            {projectsLoading ? (
              <LoadingSpinner />
            ) : upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noDeadlines')}</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map(milestone => (
                  <div key={milestone.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {milestone.milestoneName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {milestone.projectName}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {moment(milestone.dueDate).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/files/upload"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <DocumentIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className="ml-3 text-sm font-medium text-primary-900 dark:text-primary-100">
              {t('dashboard.uploadFile')}
            </span>
          </Link>
          <Link
            to="/projects/create"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <FolderIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="ml-3 text-sm font-medium text-green-900 dark:text-green-100">
              {t('dashboard.createProject')}
            </span>
          </Link>
          <Link
            to="/notifications"
            className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <BellIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <span className="ml-3 text-sm font-medium text-yellow-900 dark:text-yellow-100">
              {t('dashboard.notifications')}
            </span>
          </Link>
          <Link
            to="/reports"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="ml-3 text-sm font-medium text-purple-900 dark:text-purple-100">
              {t('dashboard.viewReports')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
