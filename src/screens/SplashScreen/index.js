import React, { Component } from 'react';
import onemvLogo from '../../assets/images/logo-onemv.svg';
import { i18n } from '../../utils';
import './SplashScreen.scss';

class SplashScreen extends Component {
  componentDidMount = () => {}

  render = () => (
    <div className="font- w-full flex h-screen items-center splashScreen">
      <div className="w-4/6 mx-auto">
        <img
          className="w-full"
          src={onemvLogo}
          alt={i18n('APP_NAME')}
        />
      </div>
    </div>
  );
}

export default SplashScreen;
