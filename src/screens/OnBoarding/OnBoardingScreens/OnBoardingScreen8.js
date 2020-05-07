/* eslint-disable camelcase */
import React, { Component } from 'react';

import {
  Text,
} from '../../../components';

import nav_menu from '../../../assets/images/nav-menu_high.png';
import nav_arrow from '../../../assets/images/nav-menu-arrow-1.svg';
import menu_arrow from '../../../assets/images/nav-menu-arrow-2.svg';

import '../OnBoarding.scss';

class OnBoardingScreen8 extends Component {
  state = {
    loaded: null,
  }

  render = () => {
    const { loaded } = this.state;
    return (
      <div className="max-screen">
        <h2 className="text-white pt-5 text-2xl font-bold">
          <Text text="NAVIGATION_MENU" />
        </h2>
        <section className="max-screen center-container w-full flex-col flex items-center flex-1 justify-center">
          <div className="relative">
            <img onLoad={() => this.setState({ loaded: true })} src={nav_menu} alt="login" className="max-screen" />
            {
              loaded
              && ((
                <>
                  <div className="flex w-full text-white px-20 onboarding-content-nav">
                    <img src={nav_arrow} alt="nav_arrow" />
                    <p className="flex-auto mb-20">
                      <Text text="TAP_TO_SEE_OTHER_AREAS_OF_THE_APP" />
                    </p>
                  </div>
                  <div className="flex w-full text-white px-5 onboarding-content-menu text-right">
                    <p className="flex-auto mb-20 right ml-20 mr-2">
                      <Text text="TAP_TO_OPEN_THE_NAVIGATION" />
                    </p>
                    <img src={menu_arrow} alt="menu_arrow" className="right" />
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

export default (OnBoardingScreen8);
