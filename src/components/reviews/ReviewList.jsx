import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const ReviewList = ({ reviews, isLoading }) => {
  const { t } = useTranslation();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="card p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('reviews.averageRating')}
          </h3>
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white mr-2">
              {getAverageRating()}
            </span>
            <div className="flex">
              {renderStars(Math.round(getAverageRating()))}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {reviews.length} {t('reviews.totalReviews')}
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 card">
          <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('reviews.noReviews')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('reviews.beFirstToReview')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.supervisor?.profileImage ? (
                    <img
                      src={review.supervisor.profileImage}
                      alt={review.supervisor.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {review.supervisor?.name}
                    </p>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {moment(review.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {review.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
