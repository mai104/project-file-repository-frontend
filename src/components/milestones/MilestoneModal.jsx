import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createMilestone, updateMilestone } from '../../store/projectSlice';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const MilestoneModal = ({ isOpen, onClose, milestone, projectId, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    milestoneName: Yup.string()
      .required(t('milestones.nameRequired'))
      .min(3, t('milestones.nameMinLength')),
    description: Yup.string()
      .max(500, t('milestones.descriptionMaxLength')),
    dueDate: Yup.date()
      .required(t('milestones.dueDateRequired'))
      .min(new Date(), t('milestones.dueDateFuture')),
  });

  const formik = useFormik({
    initialValues: {
      milestoneName: milestone?.milestoneName || '',
      description: milestone?.description || '',
      dueDate: milestone?.dueDate ? moment(milestone.dueDate).format('YYYY-MM-DD') : moment().add(1, 'week').format('YYYY-MM-DD'),
      status: milestone?.status || 'not_started',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (milestone) {
          await dispatch(updateMilestone({
            projectId,
            milestoneId: milestone.id,
            milestoneData: values
          })).unwrap();
          toast.success(t('milestones.updateSuccess'));
        } else {
          await dispatch(createMilestone({
            projectId,
            milestoneData: values
          })).unwrap();
          toast.success(t('milestones.createSuccess'));
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error(error || t('common.error'));
      }
    },
  });

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {milestone ? t('milestones.editMilestone') : t('milestones.createMilestone')}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="milestoneName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('milestones.milestoneName')}
                    </label>
                    <input
                      id="milestoneName"
                      type="text"
                      {...formik.getFieldProps('milestoneName')}
                      className={`mt-1 input-field ${
                        formik.touched.milestoneName && formik.errors.milestoneName 
                          ? 'border-red-500' 
                          : ''
                      }`}
                    />
                    {formik.touched.milestoneName && formik.errors.milestoneName && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.milestoneName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('milestones.description')}
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...formik.getFieldProps('description')}
                      className={`mt-1 input-field ${
                        formik.touched.description && formik.errors.description 
                          ? 'border-red-500' 
                          : ''
                      }`}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('milestones.dueDate')}
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      {...formik.getFieldProps('dueDate')}
                      className={`mt-1 input-field ${
                        formik.touched.dueDate && formik.errors.dueDate 
                          ? 'border-red-500' 
                          : ''
                      }`}
                    />
                    {formik.touched.dueDate && formik.errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.dueDate}</p>
                    )}
                  </div>

                  {milestone && (
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('milestones.status')}
                      </label>
                      <select
                        id="status"
                        {...formik.getFieldProps('status')}
                        className="mt-1 input-field"
                      >
                        <option value="not_started">{t('milestones.notStarted')}</option>
                        <option value="in_progress">{t('milestones.inProgress')}</option>
                        <option value="completed">{t('milestones.completed')}</option>
                      </select>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-outline"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="btn-primary"
                    >
                      {formik.isSubmitting ? t('common.saving') : t('common.save')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MilestoneModal;
