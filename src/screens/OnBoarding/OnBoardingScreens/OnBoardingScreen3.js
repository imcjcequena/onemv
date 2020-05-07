/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import registration_arrow from '../../../assets/images/registration-arrow-1.svg';
import registration_img from '../../../assets/images/registration-img.png';

import '../OnBoarding.scss';

class OnBoardingScreen3 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (    
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="REGISTRATION" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={registration_img} alt="registration" className="px-12 max-screen" />
            {
              loaded
              && ((
                <div className="flex w-full text-white px-16 onboarding-content">
                  <p className="flex-auto mb-10 mr-2">
                    <Text text="ONBOARDING_REGISTRATION_INFO" />
                  </p>
                  <img src={registration_arrow} alt="registration_arrow" className="registration_arrow" />
                </div>
              ))
            }
          </div>
        </section>
      </div>
    );
  }
}

export default (OnBoardingScreen3);
