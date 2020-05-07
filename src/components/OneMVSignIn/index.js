import React from 'react';
import { Link } from 'react-router-dom';
import './OneMVSignIn.scss';


const OneMVSignIn = (props) => {
  const {
    children,
  } = props;
  return (
    <Link to="/onemvSignIn">
      <button
        className="rounded-full w-full bg-onemv-signin-button border-2 border-solid border-white text-white py-3 px-4 my-2 rounded"
        type="button"
      >
        {children}
      </button>
    </Link>
  );
};

export default OneMVSignIn;
