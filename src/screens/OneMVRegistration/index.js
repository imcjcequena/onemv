/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import {
  validateEmail, validatePassword, mutation, i18n, checkPasswordStrength,
} from '../../utils';
import {
  Header,
  Card,
  Input,
  Label,
  ScreenContainer,
  Mutation,
  Text,
  Spinner,
  PasswordInput,
} from '../../components';
import './OneMVRegistration.scss';

class OneMVRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: i18n('CREATE_ACCOUNT'),
      disabled: false,
      background: 'bg-gray-200',
      email: '',
      loginPassword: '',
      verifyPassword: '',
      phone: '',
      formErrors: {
        errorEmail: null,
        errorLoginPassword: null,
        errorVerifyPassword: null,
        errorPhone: null,
        errorSubmit: null,
      },
      countryCode: '1',
      countryCodeList: [
        '1',
      ],
      passwordStrength: null,
    };
  }

  componentDidMount = () => {
    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');

    const { history, onBoarding } = this.props;

    if (!onBoarding) {
      if (userToken && idToken && division) return history.push('/home');
      if (!division) return history.push('/');
      if (!userToken) return history.push('/clientVerification');
    }
  }

  switchKey = (key) => {
    switch (key) {
      case 'loginPassword': return 'errorLoginPassword';
      case 'verifyPassword': return 'errorVerifyPassword';
      case 'phone': return 'errorPhone';
      default: return 'errorEmail';
    }
  }

  switchPassword = (passwordError) => {
    switch (passwordError) {
      case 'password.length': return i18n('PASSWORD_LENGTH_ERROR');
      case null: return null;
      default: return i18n('INVALID_PASSWORD');
    }
  }

  onInputChange = (key, value) => {
    const error = this.switchKey(key);
    const { formErrors } = this.state;
    if (key === 'phone') {
      if (value.length < 11) {
        if (this.checkNumber(value)) {
          if (value.length < 10 && value.length > 0) {
            formErrors[error] = i18n('PHONE_LENGTH_ERROR');
          } else if (value.length === 0) {
            formErrors[error] = i18n('REQUIRED');
          } else {
            formErrors[error] = null;
          }
          this.setState({ [key]: value, formErrors });
        }
      }
    } else if (key === 'email') {
      this.setState({ [key]: value });
      if (!validateEmail(value)) {
        formErrors[error] = i18n('INVALID_EMAIL');
        this.setState(formErrors);
      } else {
        formErrors[error] = null;
        this.setState(formErrors);
      }
    } else if (key === 'loginPassword' || key === 'verifyPassword') {
      if (formErrors.errorLoginPassword === i18n('PASSWORD_DOES_NOT_MATCH') && formErrors.errorVerifyPassword === i18n('PASSWORD_DOES_NOT_MATCH')) {
        formErrors.errorLoginPassword = null;
        formErrors.errorVerifyPassword = null;
      }
      formErrors[error] = this.switchPassword(validatePassword(value));
      let passwordMeterValue = null;
      if (key === 'loginPassword' && value.length > 0) {
        passwordMeterValue = checkPasswordStrength(value);
      }
      this.setState({ [key]: value, formErrors, passwordStrength: passwordMeterValue });
    } else {
      this.setState({ [key]: value, formErrors });
    }
  }

  checkNumber = (value) => {
    const reg = /^[0-9]+$|^$/;
    return reg.test(value);
  }

  validate = () => new Promise((resolve) => {
    const user = jwt.decode(localStorage.getItem('userToken'));
    const {
      email,
      loginPassword: password,
      verifyPassword,
      phone,
    } = this.state;
    const formErrors = this.clearFormErrors();
    if (email.length === 0 || password.length === 0 || phone.length === 0 || phone.length < 10
      || verifyPassword.length === 0 || password !== verifyPassword || !validateEmail(email)) {
      if (user && user.onemvEmail && user.onemvEmail === email) {
        formErrors.errorEmail = i18n('ONEMV_ACCOUNT_ALREADY_TAKEN');
      }
      if (email.length === 0) {
        formErrors.errorEmail = i18n('REQUIRED');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (!validateEmail(email)) {
          formErrors.errorEmail = i18n('INVALID_EMAIL');
        }
      }
      if (password.length === 0) {
        formErrors.errorLoginPassword = i18n('REQUIRED');
      } else {
        // eslint-disable-next-line no-lonely-if
        if (validatePassword(password) !== null || validatePassword(verifyPassword) !== null) {
          formErrors.errorLoginPassword = this.switchPassword(validatePassword(password));
          formErrors.errorVerifyPassword = this.switchPassword(validatePassword(verifyPassword));
        } else if (password !== verifyPassword) {
          formErrors.errorLoginPassword = i18n('PASSWORD_DOES_NOT_MATCH');
          formErrors.errorVerifyPassword = i18n('PASSWORD_DOES_NOT_MATCH');
        }
      }
      if (verifyPassword.length === 0) {
        formErrors.errorVerifyPassword = i18n('REQUIRED');
      }
      if (phone.length === 0) {
        formErrors.errorPhone = i18n('REQUIRED');
      } else if (phone.length < 10 && phone.length > 0) {
        formErrors.errorPhone = i18n('PHONE_LENGTH_ERROR');
      }
      this.setState({ formErrors });
    } else {
      resolve(true);
    }
  });

  clearFormErrors = () => (
    {
      errorEmail: null,
      errorLoginPassword: null,
      errorVerifyPassword: null,
      errorPhone: null,
      errorSubmit: null,
    }
  );

  storeToken = (idToken, userToken) => {
    // Store token from gooogle
    if (userToken) localStorage.setItem('userToken', userToken);
    localStorage.setItem('idToken', idToken);
  };

  // eslint-disable-next-line consistent-return
  submit = async (e, onemvSignIn, onemvLink, onemvRegister) => {
    e.preventDefault();
    const user = jwt.decode(localStorage.getItem('userToken'));
    const { history, MVStore } = this.props;
    const {
      email,
      loginPassword: password,
      phone,
      countryCode,
      formErrors,
    } = this.state;
    formErrors.errorSubmit = null;
    this.setState({ formErrors, disabled: true, background: 'bg-gray-250' });
    try {
      const isValidated = await this.validate();

      if (isValidated) {
        const register = await onemvRegister({
          email,
          password,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          countryCode,
          phone: `+${countryCode}${phone}`,
        });

        if (register.success === false) {
          formErrors.errorSubmit = register.message;
          return this.setState({ disabled: false, background: 'bg-gray-200', formErrors });
        }

        const signIn = await onemvSignIn({
          email,
          password,
        });

        if (signIn.success === false) {
          formErrors.errorSubmit = signIn.message;
          return this.setState({ disabled: false, background: 'bg-gray-200', formErrors });
        }

        const link = await onemvLink({
          passengerId: user.passengerId,
          dateOfBirth: user.dateOfBirth,
          providerId: signIn.data.idToken.payload.sub,
          email,
          divisionCode: user.divisionCode,
        });

        if (link.success === false) {
          formErrors.errorSubmit = link.message;
          return this.setState({ disabled: false, background: 'bg-gray-200', formErrors });
        }

        this.storeToken(signIn.data.idToken.jwtToken, link.data);
        const userData = jwt.decode(localStorage.getItem('userToken'));
        MVStore.setProfile({ ...userData, loginSelection: 'onemv' });
        localStorage.setItem('loginSelection', 'onemv');
        localStorage.setItem('email', email);
        history.push({
          pathname: '/onemvRegistration/success',
          // eslint-disable-next-line no-underscore-dangle
          state: { message: i18n('REGISTRATION_SUCCESSFUL'), subMessage: i18n('LOGGING_IN') },
        });
        this.setState({ disabled: false, background: 'bg-gray-200' });
      } else {
        this.setState({ disabled: false, background: 'bg-gray-200' });
      }
    } catch (error) {
      formErrors.errorSubmit = error;
      this.setState({ disabled: false, formErrors, background: 'bg-gray-200' });
    }
  }

  renderUIComponent = (onemvSignIn, onemvLink, onemvRegister, loading, error) => {
    const {
      background,
      disabled,
      email,
      loginPassword,
      verifyPassword,
      phone,
      formErrors,
      countryCode,
      countryCodeList,
      passwordStrength,
    } = this.state;
    return (
      <>
        <form onSubmit={e => this.submit(e, onemvSignIn, onemvLink, onemvRegister)}>
          <Card className="my-6 p-4">
            <div className="mb-3">
              <Label className="block text-left" htmlFor="email">
                <Text text="EMAIL" />
              </Label>
              <Input
                onChange={e => this.onInputChange('email', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="email"
                name="email"
                value={email}
                type="email"
                placeholder={i18n('EMAIL_ADDRESS')}
                error={loading ? null : formErrors.errorEmail}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <Label className="block text-left" htmlFor="loginPassword">
                <Text text="PASSWORD" />
              </Label>
              <PasswordInput
                onChange={e => this.onInputChange('loginPassword', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="loginPassword"
                name="loginPassword"
                value={loginPassword}
                type="password"
                placeholder={i18n('PASSWORD')}
                error={loading ? null : formErrors.errorLoginPassword}
                disabled={loading}
                passwordStrength={passwordStrength}
              />
            </div>
            <div className="mb-3">
              <Label className="block text-left" htmlFor="verifyPassword">
                <Text text="VERIFY_PASSWORD" />
              </Label>
              <Input
                onChange={e => this.onInputChange('verifyPassword', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="verifyPassword"
                name="verifyPassword"
                value={verifyPassword}
                type="password"
                placeholder={i18n('VERIFY_PASSWORD')}
                error={loading ? null : formErrors.errorVerifyPassword}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <Label className="block text-left" htmlFor="phone">
                <Text text="PHONE" />
              </Label>
              <div className="flex flex-wrap">
                <div className="w-1/4 mr-2">
                  <div className="w-full mb-5 rounded">
                    <Input
                      type="select"
                      aria-label="country code"
                      className={`w-full border border-solid border-gray-300 ${background} p-3 rounded `}
                      onChange={e => this.onInputChange('countryCode', e.target.value)}
                      disabled={loading}
                      value={countryCode}
                      error={null}
                    >
                      {
                        countryCodeList.map(item => (
                          <option key={`${item}-countryCodeList`} value={item}>
                            +
                            {item}
                          </option>
                        ))
                      }
                    </Input>
                  </div>
                </div>
                <div className="flex-grow ml-2">
                  <Input
                    onChange={e => this.onInputChange('phone', e.target.value)}
                    className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                    id="phone"
                    name="phone"
                    value={phone}
                    type="text"
                    error={loading ? null : formErrors.errorPhone}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            {(error || formErrors.errorSubmit) && (
              <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                <i className="icon-error self-center text-lg mr-2" />
                <span>{error || formErrors.errorSubmit}</span>
              </div>
            )}
          </Card>
          <div>
            {loading ? <div className="w-full"><Spinner /></div>
              : (
                <button
                  className="rounded-full w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                  type="submit"
                >
                  <Text text="REGISTER" />
                </button>
              )}
          </div>
        </form>
      </>
    );
  }

  render = () => {
    const {
      name,
    } = this.state;
    const { onBoarding } = this.props;
    return (
      <ScreenContainer className={onBoarding ? 'registrationSelection h-full' : 'registrationSelection'}>
        <Header title={name} />
        {
          !onBoarding
          && ((
            <div className="block flex-col container mx-auto flex-grow">
              <div className="content-container mx-5 flex-grow">
                <Mutation url={mutation.onemvSignIn} method="POST">
                  {(onemvSignIn, { loading: onemvSignInLoading, error: onemvSignInError }) => (
                    <Mutation url={mutation.onemvLink} method="POST">
                      {(onemvLink, { loading: onemvLinkLoading, error: onemvLinkError }) => (
                        <Mutation url={mutation.onemvRegister} method="POST">
                          {(onemvRegister, { loading: onemvRegisterLoading, error: onemvRegisterError }) => {
                            // eslint-disable-next-line max-len
                            const component = this.renderUIComponent(onemvSignIn, onemvLink, onemvRegister, onemvSignInLoading || onemvLinkLoading || onemvRegisterLoading, onemvSignInError || onemvLinkError || onemvRegisterError);
                            return component;
                          }}
                        </Mutation>
                      )}
                    </Mutation>
                  )}
                </Mutation>
              </div>
            </div>
          ))
        }
        {
          onBoarding
          && ((
            <div className="absolute bottom-0 w-full mb-32 px-5">
              <button
                className="rounded-full max-screen  w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                type="submit"
              >
                <Text text="REGISTER" />
              </button>
            </div>
          ))
        }
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(OneMVRegistration));
