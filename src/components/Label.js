import React from 'react';

const Label = (props) => {
  const {
    children,
    htmlFor,
  } = props;
  return (
    <label htmlFor={htmlFor} {...props}>
      { children }
    </label>
  );
};
export default Label;
