/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import state_arrow from '../../../assets/images/select-service-arrow-1.svg';
import service_arrow from '../../../assets/images/select-service-arrow-2.svg';
import select_service_img from '../../../assets/images/selectservice-img.png';

import '../OnBoarding.scss';

class OnBoardingScreen1 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="SELECT_YOUR_SERVICE" />
        </h2>
        <p className="text-white pt-1 mx-4">
          <Text text="ONBOARDING_SERVICE_SELECTION_INFO" />
        </p>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={select_service_img} alt="login" className="max-screen" />
            {
              loaded
              && ((
                <>
                  <div className="flex w-full text-white px-10 onboarding-content-state text-right">
                    <p className="flex-auto mb-12 mr-2">
                      <Text text="TAP_TO_SELECT_YOUR_STATE" />
                    </p>
                    <img src={state_arrow} alt="state_arrow" />
                  </div>
                  <div className="flex w-full text-white px-10 onboarding-content-service text-left">
                    <img src={service_arrow} alt="service_arrow" />
                    <p className="flex-auto mt-12 ml-2">
                      <Text text="TAP_TO_SELECT_YOUR_SERVICE" />
                    </p>
                  </div>
                </>
              ))
            }
          </div>
        </section>
      </div>
    );
  }
}

export default (OnBoardingScreen1);
