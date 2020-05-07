/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import login_arrow from '../../../assets/images/login-arrow-1.svg';
import login_img from '../../../assets/images/login-img.png';

import '../OnBoarding.scss';

class OnBoardingScreen2 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="DIFFERENT_WAYS_TO_LOGIN" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={login_img} alt="login" className="max-screen" />
            {
              loaded
              && ((
                <div className="flex w-full text-white px-10 onboarding-content">
                  <img src={login_arrow} alt="login_arrow" />
                  <span>
                    <p className="flex-auto mb-12">
                      <Text text="ONBOARDING_AUTHENTICATION_INFO" />
                    </p>
                  </span>
                </div>
              ))
            }
          </div>
        </section>
      </div>
    );
  }
}

export default (OnBoardingScreen2);
