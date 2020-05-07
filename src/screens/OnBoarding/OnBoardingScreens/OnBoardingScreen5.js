/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import trip_details from '../../../assets/images/trip-details_high.png';
import trip_details_arrow from '../../../assets/images/trip-details-arrow-1.svg';

import '../OnBoarding.scss';

class OnBoardingScreen5 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="TRIP_DETAILS" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={trip_details} alt="trip_details" className="px-16 max-screen" />
            {
              loaded
              && (( 
                <div className="flex text-white onboarding-content-trip-details">
                  <img src={trip_details_arrow} alt="trip_details_arrow" />
                  <p className="flex-auto mb-10 trip-details-text">
                    <Text text="TAP_TO_SWITCH_TO_MAP_VIEW" />
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

export default (OnBoardingScreen5);
