/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { GooglePlus } from '@ionic-native/google-plus';
import jwt from 'jsonwebtoken';
import { queryParamsToObject, fetchQuery, i18n } from '../../utils';
import {
  Footer,
  ScreenContainer,
  Header,
  GoogleSignIn,
  OneMVSignIn,
  Spinner,
  Text,
} from '../../components';
import './LoginSelection.scss';
import onemvLogo from '../../assets/images/logo-onemv.svg';
import { mutation, passengersApiBaseUrl } from '../../utils/Endpoints';


class LoginSelection extends Component {
  state = {
    loading: false,
    customError: null,
    isCordova: window.cordova,
  }

  signIn = (url) => {
    window.location = url;
  }

  redirectToHome = () => {
    const { history } = this.props;
    history.push('/home');
  }

  getGoogleToken = code => new Promise((resolve, reject) => {
    fetch(`${passengersApiBaseUrl + mutation.googleAuthToken}`, {
      method: 'POST',
      body: JSON.stringify({ code: decodeURIComponent(code) }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch(err => reject(err));
  });

  storeToken = (idToken, userToken) => {
    // Store token from gooogle
    if (userToken) localStorage.setItem('userToken', userToken);
    localStorage.setItem('idToken', idToken);
  };

  googleMobiLink = input => fetchQuery({ input, method: 'POST', url: mutation.googleAuthLink });

  onGoogleSignInClick = () => {
    GooglePlus.login({})
      .then((res) => {
        try {
          const googleId = res.userId;
          const token = res.idToken;
          this.processGoogleLogin(googleId, token);
        } catch (error) {
          // error handler here
          this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
        }
      })
      .catch(() => this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false }));
  }

  processGoogleLogin = async (googleId, idToken) => {
    const { MVStore, history } = this.props;
    let userData = jwt.decode(localStorage.getItem('userToken'));
    if (!googleId) {
      this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
    } else if (!userData.google || userData.google === null || userData.google === undefined) {
      // first time signin
      const googleMobiLink = await this.googleMobiLink({
        providerId: googleId,
        passengerId: userData.passengerId,
        divisionCode: userData.divisionCode,
        dateOfBirth: userData.dateOfBirth,
      });

      if (googleMobiLink.success === false && googleMobiLink.message === 'Login Provider already used') return this.setState({ customError: 'GOOGLE_ALREADY_TAKEN', loading: false });
      if (googleMobiLink.success === false) return this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });

      this.storeToken(idToken, googleMobiLink.data);
      userData = jwt.decode(localStorage.getItem('userToken'));
      MVStore.setProfile({ ...userData, loginSelection: 'google' });
      localStorage.setItem('loginSelection', 'google');

      history.push('/home');
    } else if (googleId !== userData.google) {
      this.setState({ customError: 'GOOGLE_DOESNT_MATCH', loading: false });
    } else if (googleId === userData.google) {
      this.storeToken(idToken);
      MVStore.setProfile({ ...userData, loginSelection: 'google' });
      localStorage.setItem('loginSelection', 'google');
      history.push('/home');
    } else {
      this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
    }
  }

  googleAuth = async (queryParams) => {
    // Once OAuth2 Code fetched from Google, the code will be use to get the token from google
    try {
      this.setState({ loading: true });
      const code = decodeURIComponent(queryParams.code);
      const token = await this.getGoogleToken(code);
      if (token.success) {
        const googleUserData = jwt.decode(token.data.id_token);
        const googleId = googleUserData.sub;
        const idToken = token.data.id_token;
        this.processGoogleLogin(googleId, idToken);
      } else {
        this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
      }
    } catch (error) {
      // error handler here
      this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
    }
  }

  componentDidMount = async () => {
    const { location, history, onBoarding } = this.props;

    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');


    if (!onBoarding) {
      if (userToken && idToken && division) return history.push('/home');
      if (!division) return history.push('/');
      if (!userToken) return history.push('/clientVerification');

      if (location.search) {
        const queryParams = queryParamsToObject(location.search);
        const requiredKeys = ['code', 'provider', 'session_state', 'scope'];

        // check if query params is for success google authentication
        // if (Object.keys(code).filter(item => requiredKeys.includes(item) ))
        if (Object.keys(queryParams).filter(item => requiredKeys.includes(item)).length > 0) {
          if (queryParams.provider === 'google') {
            this.googleAuth(queryParams);
          }
        } else {
          // error handler here
          this.setState({ customError: 'GOOGLE_LOGIN_FAILED', loading: false });
        }
      }
    }
  }

  redirectToServiceSelection = () => {
    const { history, MVStore } = this.props;
    localStorage.removeItem('x-division-id');
    localStorage.removeItem('x-division-code');
    MVStore.clearDivisionLogos();
    history.push('/');
  }

  render() {
    const { MVStore, onBoarding } = this.props;
    const { loading, customError, isCordova } = this.state;
    return (
      <ScreenContainer className={onBoarding ? 'registrationSelection h-full' : 'registrationSelection'}>
        <Header path="/clientVerification" />
        <div className="block flex flex-col container mx-auto flex-grow">
          <div className={onBoarding ? 'w-full items-center' : 'w-full flex-grow flex items-center'}>
            <img
              className={(MVStore && MVStore.divisionLogo) ? 'm-auto customLogo' : 'h-64 m-auto'}
              src={(MVStore && MVStore.divisionLogo) ? MVStore.divisionLogo : onemvLogo}
              alt={i18n('APP_NAME')}
            />
          </div>
          <section className="py-6">
            {
              !onBoarding
              && ((
                <>
                  <div className="px-5">
                    { loading ? <Spinner /> : <OneMVSignIn><Text text="LOGIN_WITH_ONEMV" /></OneMVSignIn> }
                  </div>
                  <div className="px-5">
                    {
                      loading ? <Spinner />
                        : (
                          <GoogleSignIn
                            cordovaLogin={isCordova}
                            onClick={isCordova ? this.onGoogleSignInClick : null}
                          />
                        )
                    }
                  </div>
                </>
              ))
            }
            { customError === 'GOOGLE_ALREADY_TAKEN'
              && (
                <>
                  <div className="px-5">
                    <div className="text-red text-lg text-left p-2  leading-none">
                      <i className="icon-error self-center text-lg mr-2" />
                      <span><Text text="GOOGLE_ALREADY_TAKEN" /></span>
                    </div>
                  </div>
                </>
              )
            }
            { customError === 'GOOGLE_DOESNT_MATCH'
              && (
                <>
                  <div className="px-5">
                    <div className="text-red text-lg text-left p-2  leading-none">
                      <i className="icon-error self-center text-lg mr-2" />
                      <span><Text text="GOOGLE_DOESNT_MATCH" /></span>
                    </div>
                  </div>
                </>
              )
            }
            { customError === 'GOOGLE_LOGIN_FAILED'
              && (
                <>
                  <div className="px-5">
                    <div className="text-red text-lg text-left p-2  leading-none">
                      <i className="icon-error self-center text-lg mr-2" />
                      <span><Text text="GOOGLE_LOGIN_FAILED" /></span>
                    </div>
                  </div>
                </>
              )
            }
          </section>
        </div>
        <Footer withLink />
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(LoginSelection));
