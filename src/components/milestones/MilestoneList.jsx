import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import MilestoneCard from './MilestoneCard';
import MilestoneModal from './MilestoneModal';

const MilestoneList = ({ milestones, projectId, isLoading, onRefresh }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const filteredMilestones = milestones
    .filter(milestone => {
      const matchesSearch = milestone.milestoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        milestone.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleEdit = (milestone) => {
    setSelectedMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleAdd = () => {
    setSelectedMilestone(null);
    setShowMilestoneModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('milestones.title')}
        </h2>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {t('milestones.createMilestone')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('milestones.searchMilestones')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="all">{t('milestones.allStatuses')}</option>
          <option value="not_started">{t('milestones.notStarted')}</option>
          <option value="in_progress">{t('milestones.inProgress')}</option>
          <option value="completed">{t('milestones.completed')}</option>
          <option value="overdue">{t('milestones.overdue')}</option>
        </select>
      </div>

      {/* Milestone List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('milestones.noMilestones')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== 'all' 
              ? t('milestones.noMatchingMilestones') 
              : t('milestones.getStarted')}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAdd}
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t('milestones.createMilestone')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onClick={() => handleEdit(milestone)}
            />
          ))}
        </div>
      )}

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <MilestoneModal
          isOpen={showMilestoneModal}
          onClose={() => setShowMilestoneModal(false)}
          milestone={selectedMilestone}
          projectId={projectId}
          onSuccess={() => {
            setShowMilestoneModal(false);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default MilestoneList;
