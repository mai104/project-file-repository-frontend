import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewForm = ({ onSubmit, initialValues = { rating: 0, feedback: '' }, isLoading }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1, t('reviews.ratingRequired'))
      .max(5, t('reviews.invalidRating'))
      .required(t('reviews.ratingRequired')),
    feedback: Yup.string()
      .min(10, t('reviews.feedbackMin'))
      .required(t('reviews.feedbackRequired')),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
    },
  });

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => formik.setFieldValue('rating', i)}
          className={`p-1 ${formik.values.rating >= i ? 'text-yellow-400' : 'text-gray-300'} 
            transition-colors duration-150 focus:outline-none hover:scale-110`}
        >
          {formik.values.rating >= i ? (
            <StarIcon className="h-8 w-8" />
          ) : (
            <StarOutlineIcon className="h-8 w-8" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('reviews.rating')}
        </label>
        <div className="flex items-center space-x-2">
          {renderStars()}
        </div>
        {formik.touched.rating && formik.errors.rating && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.rating}</p>
        )}
      </div>

      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('reviews.feedback')}
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={4}
          className={`input-field ${
            formik.touched.feedback && formik.errors.feedback 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : ''
          }`}
          placeholder={t('reviews.feedbackPlaceholder')}
          {...formik.getFieldProps('feedback')}
        />
        {formik.touched.feedback && formik.errors.feedback && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.feedback}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.submitting')}
            </span>
          ) : (
            t('reviews.submitReview')
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
