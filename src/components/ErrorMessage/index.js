import React from 'react';
// import { withRouter } from 'react-router-dom';
// import { inject, observer } from 'mobx-react';
// import { compose } from 'recompose';
import Text from '../Text';

const signoutUser = (history, store) => {
  localStorage.removeItem('idToken');
  localStorage.removeItem('userToken');
  store.clear();
  history.replace('/loginSelection');
};

const ErrorMessage = (props) => {
  const {
    className,
    onClick,
    message,
    history,
    store,
  } = props;
  return (
    <div className={className}>
      {message === 'Not a Valid Token' && signoutUser(history, store)}
      <div>
        <div><Text text="UNABLE_TO_LOAD_TRIPS" /></div>
        <button type="submit" onClick={onClick}><span className="text-blue font-bold mt-2"><Text text="REFRESH" /></span></button>
      </div>
    </div>
  );
};

export default ErrorMessage;
