/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Swipeable } from 'react-swipeable';
// eslint-disable-next-line import/no-cycle
import ServiceSelection from '../ServiceSelection';
import LoginSelection from '../LoginSelection';
import OneMVRegistration from '../OneMVRegistration';
import TripsScreen from '../TripsScreen';
import TripDetailsScreen from '../TripDetailsScreen';
import TripRatingsScreen from '../TripRatingsScreen';
import MenuScreen from '../MenuScreen';
import {
  OnBoardingScreen1,
  OnBoardingScreen2,
  OnBoardingScreen3,
  OnBoardingScreen4,
  OnBoardingScreen5,
  OnBoardingScreen6,
  OnBoardingScreen7,
  OnBoardingScreen8,
} from './OnBoardingScreens';
import {
  Text,
} from '../../components';

import './OnBoarding.scss';

class OnBoarding extends Component {
  state = {
    currentPage: 1,
    length: 8,
  }

  clickSkip = () => {
    const { history, goBackSupport } = this.props;
    if (goBackSupport) {
      goBackSupport();
    } else {
      localStorage.setItem('onBoarded', true);
      history.push('/');
    }
  }

  // eslint-disable-next-line consistent-return
  loopDot = () => {
    const { currentPage, length } = this.state;
    const rows = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= length; i++) {
      rows.push(<span key={i} className={currentPage === i ? 'dot-2 active' : 'dot-2'} />);
    }

    return (<>{rows}</>);
  }

  renderDots = () => {
    const { currentPage } = this.state;
    return (
      <div className="bottom-0 absolute w-full py-5">
        <div className="text-center">
          {this.loopDot()}
        </div>
        <div className={currentPage === 8 ? 'py-2' : 'py-5'}>
          <button type="submit" className={currentPage === 8 ? 'rounded-full bg-blue-100 text-white py-3 px-5 rounded' : 'text-white'} onClick={() => { this.clickSkip(); }}>
            {currentPage === 8 ? <Text text="LETS_GET_STARTED" /> : <Text text="SKIP" />}
          </button>
        </div>
      </div>
    );
  }

  swipeLeft = () => {
    const { currentPage, length } = this.state;
    let next;
    if (currentPage === length) {
      next = currentPage;
    } else {
      next = currentPage + 1;
    }
    this.setState({ currentPage: next });
  }

  swipeRight = () => {
    const { currentPage } = this.state;
    let next;
    if (currentPage === 1) {
      next = currentPage;
    } else {
      next = currentPage - 1;
    }
    this.setState({ currentPage: next });
  }

  renderPages = (page) => {
    if (page === 2) {
      return (
        <>
          <LoginSelection onBoarding />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen2 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 3) {
      return (
        <>
          <OneMVRegistration onBoarding />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen3 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 4) {
      return (
        <>
          <TripsScreen onBoarding />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen4 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 5) {
      return (
        <>
          <TripDetailsScreen onBoarding tripView />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen5 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 6) {
      return (
        <>
          <TripDetailsScreen onBoarding mapView />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen6 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 7) {
      return (
        <>
          <TripRatingsScreen onBoarding />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen7 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    if (page === 8) {
      return (
        <>
          <MenuScreen onBoarding />
          <div
            onClick={() => this.swipeLeft()}
            className="onboarding-container"
          >
            <OnBoardingScreen8 />
            {this.renderDots()}
          </div>
        </>
      );
    }
    return (
      <>
        <ServiceSelection onBoarding />
        <div
          onClick={() => this.swipeLeft()}
          className="onboarding-container"
        >
          <OnBoardingScreen1 />
          {this.renderDots()}
        </div>
      </>
    );
  }

  render = () => {
    const { currentPage } = this.state;
    const { swipeLeft, swipeRight } = this;
    return (
      <>
        <Swipeable
          trackMouse
          preventDefaultTouchmoveEvent
          onSwipedLeft={() => swipeLeft()}
          onSwipedRight={() => swipeRight()}
          className="h-screen"
        >
          {this.renderPages(currentPage)}
        </Swipeable>
      </>
    );
  }
}

export default withRouter(OnBoarding);
