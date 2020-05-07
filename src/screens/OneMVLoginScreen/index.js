/* eslint-disable consistent-return, react/no-unused-state */
import React, { Component } from 'react';
import { compose } from 'recompose';
import jwt from 'jsonwebtoken';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { mutation, i18n } from '../../utils';
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
  Text,
} from '../../components';
import './OneMVLoginScreen.scss';
import onemvLogo from '../../assets/images/ic-onemv-logo.svg';

class OneMVLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      background: 'bg-gray-200',
      email: '',
      errorEmail: null,
      password: '',
      errorPassword: null,
      errorSubmit: null,
      customError: null,
    };
  }

  componentDidMount = () => {
    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');

    const { history } = this.props;

    if (userToken && idToken && division) return history.push('/home');

    if (!division) return history.push('/');
  }

  storeToken = (idToken, userToken) => {
    // Store token from cognito
    if (userToken) localStorage.setItem('userToken', userToken);
    localStorage.setItem('idToken', idToken);
  };

  validate = () => new Promise((resolve) => {
    this.setState({ errorEmail: null, errorPassword: null, customError: null });
    const { email, password } = this.state;
    if (email.length < 1) return this.setState({ errorEmail: i18n('REQUIRED') }, () => resolve(false));
    if (password.length < 1) return this.setState({ errorPassword: i18n('REQUIRED') }, () => resolve(false));
    return this.setState({ errorEmail: null, errorPassword: null }, () => resolve(true));
  })

  submit = async (e, signin, onemvLink) => {
    e.preventDefault();
    const user = jwt.decode(localStorage.getItem('userToken'));
    const { history, MVStore } = this.props;
    const { email, password } = this.state;
    const isValidated = await this.validate();

    if (email !== user.onemvEmail) {
      return this.setState({ customError: i18n('ONEMV_EMAIL_DOESNT_MATCH') });
    }

    if (isValidated) {
      const signIn = await signin({ email, password });
      if (signIn.success === true) {
        // if no onemv for the user, link email and cognito id
        if (!user.onemvEmail) {
          const link = await onemvLink({
            passengerId: user.passengerId,
            dateOfBirth: user.dateOfBirth,
            providerId: signIn.data.idToken.payload.sub,
            email,
            divisionCode: user.divisionCode,
          });

          if (link.success === true) {
            this.storeToken(signIn.data.idToken.jwtToken, link.data);
            localStorage.setItem('email', email);
            MVStore.setProfile({ ...user, loginSelection: 'onemv' });
            localStorage.setItem('loginSelection', 'onemv');
            history.push('/home');
          }
        } else {
          MVStore.setProfile({ ...user, loginSelection: 'onemv' });
          localStorage.setItem('loginSelection', 'onemv');
          this.storeToken(signIn.data.idToken.jwtToken);
          localStorage.setItem('email', email);
          history.push('/home');
        }
      }
    }
  }

  onInputChange = (key, value) => {
    this.setState({ [key]: value });
  }

  render = () => {
    const user = localStorage.getItem('userToken') && jwt.decode(localStorage.getItem('userToken'));
    const {
      disabled,
      emailId,
      errorEmail,
      loginPassword,
      errorPassword,
      customError,
    } = this.state;
    return (
      <ScreenContainer className="registrationSelection">
        <Header>
          {/* added w-10 h-6 for IE fix for img-stretch */}
          <img src={onemvLogo} alt="onemv-logo" className="w-10 h-6 text-center flex-grow" />
        </Header>
        <div className="block flex-col container mx-auto flex-grow">
          <h1 className="m-4">
            <span className="text-xl font-semibold"><Text text="LOGIN" /></span>
          </h1>
          <div className="content-container mx-5 flex-grow">
            <Mutation url={mutation.onemvLink} method="POST">
              {(onemvLink, { loading: onemvLinkLoading, error: onemvLinkError }) => (
                <Mutation url={mutation.onemvSignIn} method="POST">
                  {(onemvSignIn, { loading: onemvSignInLoading, error: onemvSignInError }) => {
                    const error = onemvLinkError || onemvSignInError || customError;
                    const loading = onemvLinkLoading || onemvSignInLoading;
                    const background = loading ? 'bg-gray-250' : 'bg-gray-200';
                    return (
                      <>
                        <form onSubmit={e => this.submit(e, onemvSignIn, onemvLink)}>
                          <Card className="my-6 p-4">
                            <div className="mb-3">
                              <Label className="block text-left" htmlFor="emailId">
                                <Text text="EMAIL" />
                              </Label>
                              <Input
                                onChange={e => this.onInputChange('email', e.target.value)}
                                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                                id="emailId"
                                name="emailId"
                                value={emailId}
                                type="email"
                                placeholder={i18n('YOUR_EMAIL')}
                                error={errorEmail}
                                disabled={loading}
                              />
                            </div>
                            <div className="mb-3">
                              <Label className="block text-left" htmlFor="loginPassword">
                                <Text text="PASSWORD" />
                              </Label>
                              <PasswordInput
                                onChange={e => this.onInputChange('password', e.target.value)}
                                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                                id="loginPassword"
                                name="loginPassword"
                                value={loginPassword}
                                type="password"
                                placeholder={i18n('YOUR_PASSWORD')}
                                error={loading ? null : errorPassword}
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
                                      <Text text="LOGIN" />
                                    </button>
                                  </div>
                                  <div className="flex justify-around mt-4 text-blue-600">
                                    {
                                      user && !user.onemvEmail && (
                                        <Link to="/onemvRegistration">
                                          <span className="onemv-font">{i18n('REGISTER')}</span>
                                        </Link>
                                      )
                                    }
                                    <Link to="/onemvForgotPassword">
                                      <span className="onemv-font">{i18n('FORGOT_PASSWORD')}</span>
                                    </Link>
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
        <Footer withLink />
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(OneMVLoginScreen));
