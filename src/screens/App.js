import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import { Switch, Route, withRouter } from 'react-router-dom';
import { temporaryClearCache, goBack } from '../utils';
import ServiceSelection from './ServiceSelection';
import ClientVerification from './ClientVerification';
import LoginSelection from './LoginSelection';
import AppHomeContainer from './AppHomeContainer';
import OneMVLoginScreen from './OneMVLoginScreen';
import OneMVRegistrationScreen from './OneMVRegistration';
import OneMVRegistrationSuccessScreen from './OneMVRegistration/Success';
import OneMVChangePasswordScreen from './ChangePassword';
import OneMVChangePasswordSuccessScreen from './ChangePassword/Success';
import OneMVForgotPassword from './OneMVForgotPasswordScreen';
import OneMVPasswordReset from './OneMVPasswordResetScreen';
import SupportScreen from './SupportScreen';
import WhatsNewScreen from './WhatsNewScreen';
import PoliciesScreen from './PoliciesScreen';
import PolicyDetailScreen from './PoliciesScreen/PolicyDetailScreen';
import OnBoarding from './OnBoarding';

// TODO: Redesign Navigation Flow

class App extends Component {
  state = {
    appStyle: null,
  };

  componentDidMount = () => {
    const { history, MVStore } = this.props;
    const { userAgent } = navigator;
    if (/MSIE|Trident|Edge/.test(userAgent)) {
      this.setState({ appStyle: { height: '100vh' } });
    }

    window.onpopstate = this.onBackButtonEvent;
    temporaryClearCache(history, MVStore);
  }

  onBackButtonEvent = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const currentUrl = window.location.pathname;
    goBack(history, currentUrl);
  }

  render() {
    const { appStyle } = this.state;
    return (
      <div className="App" style={appStyle}>
        <Switch>
          <Route path="/onBoarding" exact component={OnBoarding} />
          <Route path="/" exact component={ServiceSelection} />
          <Route path="/loginSelection" exact component={LoginSelection} />
          <Route path="/serviceSelection" exact component={ServiceSelection} />
          <Route path="/clientVerification" exact component={ClientVerification} />
          <Route path="/onemvSignIn" exact component={OneMVLoginScreen} />
          <Route path="/onemvRegistration" exact component={OneMVRegistrationScreen} />
          <Route path="/onemvRegistration/success" exact component={OneMVRegistrationSuccessScreen} />
          <Route path="/onemvForgotPassword" exact component={OneMVForgotPassword} />
          <Route path="/onemvPasswordReset" exact component={OneMVPasswordReset} />
          <Route path="/support" exact component={SupportScreen} />
          <Route path="/whatsNew" exact component={WhatsNewScreen} />
          <Route path="/policy" exact component={PoliciesScreen} />
          <Route path="/policyDetails/:id" exact component={PolicyDetailScreen} />
          <Route path="/onemvChangePassword" exact component={OneMVChangePasswordScreen} />
          <Route path="/onemvChangePassword/success" exact component={OneMVChangePasswordSuccessScreen} />
          <AppHomeContainer />
        </Switch>
      </div>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(App));
