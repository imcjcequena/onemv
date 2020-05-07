/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import trip_status from '../../../assets/images/tripstatus_high.png';
import location_arrow from '../../../assets/images/trip-stat-arrow-1.svg';
import car_arrow from '../../../assets/images/trip-stat-arrow-2.svg';

import '../OnBoarding.scss';

class OnBoardingScreen6 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="TRIP_STATUS" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={trip_status} alt="trip_status" className="px-10 trip-status-img max-screen" />
            {
              loaded
              && ((
                <>
                  <div className="flex w-full text-white px-8 onboarding-content-location">
                    <p className="flex-auto text-right text-pickup-location">
                      <Text text="YOUR_PICKUP_LOCATION" />
                    </p>
                    <img src={location_arrow} alt="location_arrow" className="right" />
                  </div>
                  <div className="flex w-full text-white px-8 onboarding-content-car">
                    <img src={car_arrow} alt="car_Arrow" />
                    <p className="flex-auto mt-24 text-left text-car">
                      <Text text="YOUR_BUS_IS_NEAR_THE_PICKUP_POINT" />
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

export default (OnBoardingScreen6);
