/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import rate_trip from '../../../assets/images/rate-trip_high.png';
import star_arrow from '../../../assets/images/rate-arrow-1.svg';
import comment_arrow from '../../../assets/images/rate-arrow-2.svg';

import '../OnBoarding.scss';

class OnBoardingScreen7 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="RATE_TRIP" />
        </h2>
        <section className="max-screen pt-24 w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={rate_trip} alt="trip_details" className="px-5 max-screen" />
            {
              loaded
              && ((
                <>
                  <div className="flex w-full text-white px-10 onboarding-content-star">
                    <p className="flex-auto mb-10">
                      <Text text="TAP_ON_STAR_TO_RATE_SERVICE" />
                    </p>
                    <img src={star_arrow} alt="star_arrow" />
                  </div>
                  <div className="flex w-full text-white px-24 onboarding-content-comment">
                    <p className="flex-auto mt-20 text-comment">
                      <Text text="TAP_TO_ADD_COMMENT" />
                    </p>
                    <img src={comment_arrow} alt="comment_arrow" />
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
  

export default (OnBoardingScreen7);
