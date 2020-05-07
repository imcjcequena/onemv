import React, { Component } from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import HomeScreen from '../HomeScreen';
import TripsScreen from '../TripsScreen';
import ProfileScreen from '../ProfileScreen';
import MenuScreen from '../MenuScreen';
import TripDetailsScreen from '../TripDetailsScreen';
import TripRatings from '../TripRatingsScreen';
import { goBack } from '../../utils';

// TODO: Redesign Navigation Flow

class AppHomeContainer extends Component {
  onBackButtonEvent = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const currentUrl = window.location.pathname;
    goBack(history, currentUrl);
  }

  componentDidMount = () => {
    const { history } = this.props;
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');
    const division = localStorage.getItem('x-division-id');
    if (!userToken && !idToken && !division) history.push('/');
    if (userToken && division && !idToken) history.push('/loginSelection');
    // window.onpopstate = this.onBackButtonEvent;
  };

  render = () => (
    <div className="flex-grow flex flex-col w-full AppHomeContainer">
      <Switch>
        <Route path="/home" exact component={HomeScreen} />
        <Route path="/account" exact component={ProfileScreen} />
        <Route path="/menu" exact component={MenuScreen} />
        <Route path="/trips/details/:id" exact component={TripDetailsScreen} />
        <Route path="/trips/:id/ratings" exact component={TripRatings} />
        <TripsScreen />
      </Switch>
      {/* <BottomTabNavigation /> */}
    </div>
  );
}

export default withRouter(AppHomeContainer);
