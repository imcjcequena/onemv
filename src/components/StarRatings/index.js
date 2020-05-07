import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({
  starCount,
  ratings,
  className,
  onClick,
}) => (
  <div className={`${className} starsContainer justify-between flex`}>
    {
      Array.from(Array(starCount), (e, i) => (
        <button
          type="button"
          className="bg-transparent"
          key={i}
          value={e}
          onClick={onClick ? () => onClick(i + 1) : () => {}}
        >
          <i className={i < ratings ? 'icon-star text-yellow' : 'icon-star text-gray-400'} />
        </button>
      ))
    }
  </div>
);

StarRating.propTypes = {
  starCount: PropTypes.number,
  ratings: PropTypes.number,
  className: PropTypes.string,
};

StarRating.defaultProps = {
  starCount: 5,
  ratings: 0,
  className: '',
};

export default StarRating;
