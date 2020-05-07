/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';

const HTMLCard = ({ data }) => {
  const displayHTML = data;
  return (
    <Card className="mb-4">
      <div className="text-left" dangerouslySetInnerHTML={{ __html: displayHTML }} />
    </Card>
  );
};

HTMLCard.propTypes = {
  data: PropTypes.string,
};

HTMLCard.defaultProps = {
  data: null,
};

export default HTMLCard;
