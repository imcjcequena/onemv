/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { compose } from 'recompose';
import jwt from 'jsonwebtoken';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { queryParamsToObject, i18n, checkPasswordStrength } from '../../utils';

import { mutation } from '../../utils/Endpoints';
import {
  Header,
  Footer,
  Card,
  Input,
  Label,
  ScreenContainer,
  Mutation,
  Spinner,
  PasswordInput,
} from '../../components';
import onemvLogo from '../../assets/images/ic-onemv-logo.svg';

class OneMVPasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      newPassword: '',
      retypePassword: '',
      errorNewPassword: null,
      errorRetypePassword: null,
      passwordStrength: null,
    };
  }

  componentDidMount = () => {
    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');

    const { history, location } = this.props;

    if (userToken && idToken && division) return history.push('/home');

    if (!division) return history.push('/');

    if (!location.search) return history.push('/');
  }

  storeToken = (idToken, userToken) => {
    // Store token from gooogle
    if (userToken) localStorage.setItem('userToken', userToken);
    localStorage.setItem('idToken', idToken);
  };

  validate = () => new Promise((resolve) => {
    this.setState({ errorNewPassword: null, errorRetypePassword: null });
    const { newPassword, retypePassword } = this.state;
    if (newPassword.length < 1) return this.setState({ errorNewPassword: i18n('REQUIRED') }, () => resolve(false));
    if (retypePassword.length < 1) return this.setState({ errorRetypePassword: i18n('REQUIRED') }, () => resolve(false));
    if (retypePassword !== newPassword) return this.setState({ errorRetypePassword: i18n('PASSWORD_DOES_NOT_MATCH') }, () => resolve(false));
    return this.setState({ errorNewPassword: null, errorRetypePassword: null }, () => resolve(true));
  })

  submit = async (e, onemvPasswordReset, onemvSignIn) => {
    e.preventDefault();
    const { history, location, MVStore } = this.props;
    const { newPassword } = this.state;
    const queryParams = queryParamsToObject(location.search);
    const isValidated = await this.validate();
    if (isValidated) {
      const passwordReset = await onemvPasswordReset({ newPassword });
      if (passwordReset.success === true) {
        const signIn = await onemvSignIn({ email: queryParams.email, password: newPassword });
        if (signIn.success === true) {
          this.storeToken(signIn.data.idToken.jwtToken);
          const userData = jwt.decode(localStorage.getItem('userToken'));
          MVStore.setProfile({ ...userData, loginSelection: 'onemv' });
          localStorage.setItem('loginSelection', 'onemv');
          history.push({
            pathname: '/onemvRegistration/success',
            // eslint-disable-next-line no-underscore-dangle
            state: { message: i18n('PASSWORD_RESET_SUCCESSFUL') },
          });
        }
      }
    }
  }

  onInputChange = (key, value) => {
    let passwordMeterValue = null;
    if (key === 'newPassword' && value.length > 0) {
      passwordMeterValue = checkPasswordStrength(value);
    }
    this.setState({ [key]: value, passwordStrength: passwordMeterValue });
  }

  render = () => {
    const { location } = this.props;
    const queryParams = queryParamsToObject(location.search);
    const {
      disabled,
      newPassword,
      errorNewPassword,
      retypePassword,
      errorRetypePassword,
      passwordStrength,
    } = this.state;
    return (
      <ScreenContainer className="registrationSelection">
        <Header>
          {/* added w-10 h-6 for IE fix for img-stretch */}
          <img src={onemvLogo} alt="onemv-logo" className="w-10 h-6 text-center flex-grow" />
        </Header>
        <div className="block flex-col container mx-auto flex-grow">
          <h1 className="m-4"><span className="text-xl font-semibold">{i18n('RESET_PASSWORD')}</span></h1>
          <div className="content-container mx-5 flex-grow">
            <Mutation url={mutation.onemvSignIn} method="POST">
              {(onemvSignIn, { loading: onemvSignInLoading, error: onemvSignInError }) => (
                <Mutation url={`${mutation.onemvPasswordReset}?code=${queryParams.code}&email=${queryParams.email}`} method="POST">
                  {(onemvPasswordReset, { loading: onemvPasswordResetLoading, error: onemvPasswordResetError }) => {
                    const error = onemvPasswordResetError || onemvSignInError;
                    const loading = onemvPasswordResetLoading || onemvSignInLoading;
                    const background = loading ? 'bg-gray-250' : 'bg-gray-200';
                    return (
                      <>
                        <form onSubmit={e => this.submit(e, onemvPasswordReset, onemvSignIn)}>
                          <Card className="my-6 p-4">
                            <div className="mb-3">
                              <Label className="block text-left" htmlFor="newPasswordId">
                                {i18n('NEW_PASSWORD')}
                              </Label>
                              <PasswordInput
                                onChange={e => this.onInputChange('newPassword', e.target.value)}
                                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                                id="newPasswordId"
                                name="newPasswordId"
                                value={newPassword}
                                type="password"
                                placeholder={i18n('TYPE_NEW_PASSWORD')}
                                error={loading ? null : errorNewPassword}
                                disabled={loading}
                                passwordStrength={passwordStrength}
                              />
                            </div>
                            <div className="mb-3">
                              <Label className="block text-left" htmlFor="retypePasswordId">
                                {i18n('TYPE_NEW_PASSWORD')}
                              </Label>
                              <Input
                                onChange={e => this.onInputChange('retypePassword', e.target.value)}
                                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                                id="retypePasswordId"
                                name="retypePasswordId"
                                value={retypePassword}
                                type="password"
                                placeholder={i18n('RETYPE_NEW_PASSWORD')}
                                error={loading ? null : errorRetypePassword}
                                disabled={loading}
                              />
                            </div>
                            {error && (
                              <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                                <i className="icon-error self-center text-lg mr-2" />
                                <span>{error}</span>
                              </div>
                            )}
                          </Card>
                          {
                            (loading) ? <Spinner />
                              : (
                                <>
                                  <div>
                                    <button
                                      className="rounded-full w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                                      type="submit"
                                      disabled={disabled}
                                    >
                                      {i18n('SUBMIT')}
                                    </button>
                                  </div>
                                </>
                              )
                          }
                        </form>
                      </>
                    );
                  }}
                </Mutation>
              )}
            </Mutation>


          </div>
        </div>
        <Footer />
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(OneMVPasswordReset));
