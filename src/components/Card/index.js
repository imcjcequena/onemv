import React from 'react';
import './Card.scss';

const Card = (props) => {
  const {
    id,
    className,
    children,
  } = props;

  return (
    <div
      id={id}
      className={`p-3 rounded-lg w-full cardContainer bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
