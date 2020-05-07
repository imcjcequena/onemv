import React from 'react';

const ScreenContainer = (props) => {
  const {
    children,
    className,
  } = props;
  return (
    <main {...props} className={`flex-grow flex flex-col w-full ${className}`}>
      {children}
    </main>
  );
};

export default ScreenContainer;
