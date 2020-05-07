import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import jwt from 'jsonwebtoken';
import { SplashScreen } from './screens';
import {
  i18n,
  query,
  divisionsApiBaseUrl,
  passengersApiBaseUrl,
} from './utils';
import App from './screens/App';

class AppContainer extends Component {
  state = {
    isLoading: true,
  }

  preloads = () => {

  }

  getDivision = () => new Promise((resolve, reject) => {
    fetch(`${divisionsApiBaseUrl}${query.getStates}`)
      .then(res => res.json())
      .then((data) => {
        resolve({
          states: data.data,
          selectStateText: i18n('SELECT_STATE'),
          selectServiceStext: i18n('SELECT_SERVICE'),
          backgroundState: 'bg-white',
          backgroundService: 'bg-white',
        });
      })
      .catch(err => reject(err));
  })


  getGoogleUrl = () => new Promise((resolve, reject) => {
    fetch(`${passengersApiBaseUrl + query.googleAuthUrl}`)
      .then(res => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch(err => reject(err));
  })

  componentDidMount = async () => {
    const { MVStore, location } = this.props;
    // if app has stored user
    const isFromProvider = location.search;
    const user = jwt.decode(localStorage.getItem('userToken'));
    const divisionLogo = localStorage.getItem('x-division-logo');
    const divisionLogoWhite = localStorage.getItem('x-division-logoWhite');
    if (user) {
      const profile = {
        clientId: user.clientId,
        dateOfBirth: user.dateOfBirth,
        divisionCode: user.divisionCode,
        passengerId: user.passengerId,
        firstName: user.firstName.toLowerCase(),
        lastName: user.lastName.toLowerCase(),
        middleName: user.middleName.toLowerCase(),
      };
      MVStore.setProfile(profile);
      if (divisionLogoWhite || divisionLogo) {
        MVStore.setDivisionLogo(divisionLogo);
        MVStore.setDivisionLogoWhite(divisionLogoWhite);
      }
    }

    if (isFromProvider) {
      // dont show splash screen if from google login
      this.setState({ isLoading: false });
    } else {
      setTimeout(() => this.setState({ isLoading: false }), 1000);
    }
  }

  render = () => {
    const { isLoading } = this.state;

    return (isLoading ? <SplashScreen /> : <App />);
  }
}

export default compose(inject('MVStore'), observer)(withRouter(AppContainer));
