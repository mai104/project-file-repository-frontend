import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CalendarIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const ProjectForm = ({ initialValues, onSubmit, isLoading }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    projectName: Yup.string()
      .required(t('projects.nameRequired'))
      .min(3, t('projects.nameMinLength')),
    shortDescription: Yup.string()
      .required(t('projects.descriptionRequired'))
      .min(10, t('projects.descriptionMinLength')),
    startDate: Yup.date()
      .required(t('projects.startDateRequired')),
    endDate: Yup.date()
      .required(t('projects.endDateRequired'))
      .min(Yup.ref('startDate'), t('projects.endDateAfterStart')),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      projectName: '',
      shortDescription: '',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('projects.projectName')}
        </label>
        <input
          id="projectName"
          type="text"
          {...formik.getFieldProps('projectName')}
          className={`mt-1 input-field ${
            formik.touched.projectName && formik.errors.projectName 
              ? 'border-red-500' 
              : ''
          }`}
        />
        {formik.touched.projectName && formik.errors.projectName && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.projectName}</p>
        )}
      </div>

      <div>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('projects.projectDescription')}
        </label>
        <textarea
          id="shortDescription"
          rows={4}
          {...formik.getFieldProps('shortDescription')}
          className={`mt-1 input-field ${
            formik.touched.shortDescription && formik.errors.shortDescription 
              ? 'border-red-500' 
              : ''
          }`}
        />
        {formik.touched.shortDescription && formik.errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.shortDescription}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('projects.startDate')}
          </label>
          <div className="mt-1 relative">
            <input
              id="startDate"
              type="date"
              {...formik.getFieldProps('startDate')}
              className={`input-field ${
                formik.touched.startDate && formik.errors.startDate 
                  ? 'border-red-500' 
                  : ''
              }`}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {formik.touched.startDate && formik.errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('projects.endDate')}
          </label>
          <div className="mt-1 relative">
            <input
              id="endDate"
              type="date"
              {...formik.getFieldProps('endDate')}
              className={`input-field ${
                formik.touched.endDate && formik.errors.endDate 
                  ? 'border-red-500' 
                  : ''
              }`}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {formik.touched.endDate && formik.errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
