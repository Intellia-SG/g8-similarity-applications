// src/components/gamification/StarRating.jsx
// Star rating component (0 to 3 stars)

import React from 'react';

export default function StarRating({ stars = 0, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'star-sm' : size === 'lg' ? 'star-lg' : 'star-md';

  return (
    <div className={`star-rating-row ${sizeClass}`} aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((starNum) => (
        <span
          key={starNum}
          className={`star-icon ${starNum <= stars ? 'star-filled' : 'star-empty'}`}
        >
          {starNum <= stars ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}
