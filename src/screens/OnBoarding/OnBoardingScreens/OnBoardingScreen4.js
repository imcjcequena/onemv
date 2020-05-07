/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import tripcard from '../../../assets/images/tripcard_high.png';
import tripcard_arrow from '../../../assets/images/trip-reserve-card-arow-1.svg';

import '../OnBoarding.scss';

class OnBoardingScreen4 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="TRIP_RESERVATION_CARD" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={tripcard} alt="tripcard" className="max-screen" />
            {
              loaded
              && ((
                <div className="flex w-full text-white px-16 onboarding-content-tripcard">
                  <img src={tripcard_arrow} alt="tripcard_arrow" />
                  <p className="flex-auto mb-16 ml-2">
                    <Text text="ONBOARDING_TRIP_CARD_INFO" />
                  </p>
                </div>
              ))
            }
          </div>
        </section>
      </div>

    );
  }
}

export default (OnBoardingScreen4);
