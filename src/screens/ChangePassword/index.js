import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Header,
  Card,
  Input,
  Label,
  ScreenContainer,
  Mutation,
  Spinner,
  Text,
  PasswordInput,
} from '../../components';
import { mutation, i18n, checkPasswordStrength } from '../../utils';
import './ChangePassword.scss';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: i18n('CHANGE_PASSWORD'),
      oldPassword: '',
      errorOldPassword: null,
      newPassword: '',
      errorNewPassword: null,
      verifyPassword: '',
      errorVerifyPassword: null,
      errorSubmit: null,
      passwordStrength: null,
    };
  }

  componentDidMount = () => {
  }

  switchKey = (key) => {
    switch (key) {
      case 'oldPassword': return 'errorOldPassword';
      case 'newPassword': return 'errorNewPassword';
      case 'verifyPassword': return 'errorVerifyPassword';
      default: return 'errorSubmit';
    }
  }

  onInputChange = (key, value) => {
    const error = this.switchKey(key);
    let passwordMeterValue = null;
    if (key === 'newPassword' && value.length > 0) {
      passwordMeterValue = checkPasswordStrength(value);
    }
    this.setState({ [key]: value, [error]: null, passwordStrength: passwordMeterValue });
  }

  validate = () => new Promise((resolve) => {
    const {
      oldPassword,
      newPassword: password,
      verifyPassword,
    } = this.state;
    if (oldPassword.length === 0 || password.length === 0
      || verifyPassword.length === 0 || password !== verifyPassword) {
      if (oldPassword.length === 0) {
        this.setState({ errorOldPassword: i18n('REQUIRED') }, () => resolve(false));
      }
      if (password.length === 0) {
        this.setState({ errorNewPassword: i18n('REQUIRED') }, () => resolve(false));
      } else {
        // eslint-disable-next-line no-lonely-if
        if (password !== verifyPassword) {
          this.setState({
            errorVerifyPassword: i18n('PASSWORD_DOES_NOT_MATCH'),
          }, () => resolve(false));
        }
      }
      if (verifyPassword.length === 0) {
        this.setState({ errorVerifyPassword: i18n('REQUIRED') }, () => resolve(false));
      }
    } else {
      resolve(true);
    }
  });

  // eslint-disable-next-line consistent-return
  submit = async (e, onemvChangePassword) => {
    e.preventDefault();
    const { history } = this.props;

    const validated = await this.validate();

    if (validated) {
      const email = localStorage.getItem('email');
      const { oldPassword, newPassword } = this.state;
      const result = await onemvChangePassword({ email, oldPassword, newPassword });
      if (result && result) {
        history.push('/onemvChangePassword/success');
      }
    }
  }

  renderUIComponent = (onemvChangePassword, loading, error, background) => {
    const {
      oldPassword,
      errorOldPassword,
      newPassword,
      errorNewPassword,
      verifyPassword,
      errorVerifyPassword,
      errorSubmit,
      passwordStrength,
    } = this.state;
    return (
      <>
        <form onSubmit={e => this.submit(e, onemvChangePassword)}>
          <Card className="my-6 p-4">
            <div className="mb-3">
              <Label className="block text-left" htmlFor="oldPassword">
                <Text text="OLD_PASSWORD" />
              </Label>
              <Input
                onChange={e => this.onInputChange('oldPassword', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                type="password"
                placeholder="Type old password"
                error={errorOldPassword}
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <Label className="block text-left" htmlFor="newPassword">
                <Text text="NEW_PASSWORD" />
              </Label>
              <PasswordInput
                onChange={e => this.onInputChange('newPassword', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                type="password"
                placeholder="Type new password"
                error={errorNewPassword}
                disabled={loading}
                passwordStrength={passwordStrength}
              />
            </div>
            <div className="mb-3">
              <Label className="block text-left" htmlFor="verifyPassword">
                <Text text="RETYPE_NEW_PASSWORD" />
              </Label>
              <Input
                onChange={e => this.onInputChange('verifyPassword', e.target.value)}
                className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                id="verifyPassword"
                name="verifyPassword"
                value={verifyPassword}
                type="password"
                placeholder="Re-type new password"
                error={errorVerifyPassword}
                disabled={loading}
              />
            </div>
            {errorSubmit && (
              <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                <i className="icon-error self-center text-lg mr-2" />
                <span>{errorSubmit}</span>
              </div>
            )}
            {error && (
              <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                <i className="icon-error self-center text-lg mr-2" />
                <span>{error}</span>
              </div>
            )}
          </Card>
          <div>
            {loading && loading ? <Spinner />
              : (
                <button
                  className="verifyButton rounded-full w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                  type="submit"
                >
                  <Text text="CHANGE_PASSWORD" />
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
    return (
      <ScreenContainer className="registrationSelection">
        <Header title={name} />
        <div className="block flex-col container mx-auto flex-grow">
          <div className="content-container mx-5 flex-grow">
            <Mutation url={mutation.onemvChangePassword} method="POST">
              {(onemvChangePassword, { loading: onemvChangePasswordLoading, error: onemvChangePasswordError }) => {
                // eslint-disable-next-line max-len
                const background = onemvChangePasswordLoading ? 'bg-gray-250' : 'bg-gray-200';
                const component = this.renderUIComponent(onemvChangePassword, onemvChangePasswordLoading, onemvChangePasswordError, background);
                return component;
              }}
            </Mutation>
          </div>
        </div>
      </ScreenContainer>
    );
  }
}
export default withRouter(ChangePassword);
