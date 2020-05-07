/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { maskedEmail, validateEmail, i18n } from '../../utils';
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
} from '../../components';
import onemvLogo from '../../assets/images/ic-onemv-logo.svg';

class OneMVForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      email: '',
      errorEmail: null,
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


  validate = () => new Promise((resolve) => {
    this.setState({ errorEmail: null });
    const { email } = this.state;
    if (email.length < 1) return this.setState({ errorEmail: i18n('REQUIRED') }, () => resolve(false));
    if (!validateEmail(email)) return this.setState({ errorEmail: i18n('NOT_A_VALID_EMAIL') }, () => resolve(false));
    return this.setState({ errorEmail: null }, () => resolve(true));
  })

  submit = async (e, onemvForgotPassword) => {
    e.preventDefault();
    const { history } = this.props;
    const { email } = this.state;


    const isValidated = await this.validate();

    if (isValidated) {
      const forgotPassword = await onemvForgotPassword({ email });
      if (forgotPassword.success === true) {
        history.push({
          pathname: '/onemvRegistration/success',
          // eslint-disable-next-line no-underscore-dangle
          state: { subMessage: i18n('PASSWORD_RECOVERY_SUCCESS_MESSAGE') + maskedEmail(email) },
        });
      }
    }
  }

  onInputChange = (key, value) => {
    this.setState({ [key]: value });
  }

  render = () => {
    const {
      disabled,
      emailId,
      errorEmail,
    } = this.state;
    return (
      <ScreenContainer className="registrationSelection">
        <Header>
          {/* added w-10 h-6 for IE fix for img-stretch */}
          <img src={onemvLogo} alt="onemv-logo" className="w-10 h-6 text-center flex-grow" />
        </Header>
        <div className="block flex-col container mx-auto flex-grow">
          <h1 className="m-4"><span className="text-xl font-semibold">{i18n('PASSWORD_RECOVERY')}</span></h1>
          <div className="content-container mx-5 flex-grow">
            <Mutation url={mutation.onemvForgotPassword} method="POST">
              {(onemvForgotPassword, { loading, error: onemvForgotPasswordError }) => {
                const background = loading ? 'bg-gray-250' : 'bg-gray-200';
                let error = onemvForgotPasswordError;
                if (onemvForgotPasswordError === 'Username/client id combination not found.') error = i18n('EMAIL_NOT_YET_VERIFIED');
                return (
                  <>
                    <form onSubmit={e => this.submit(e, onemvForgotPassword)}>
                      <Card className="my-6 p-4">
                        <div className="mb-3">
                          <Label className="block text-center mb-1" htmlFor="emailId">
                            {i18n('PASSWORD_RECOVERY_MESSAGE')}
                          </Label>
                          <Input
                            onChange={e => this.onInputChange('email', e.target.value)}
                            className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                            id="emailId"
                            name="emailId"
                            value={emailId}
                            type="email"
                            placeholder={i18n('YOUR_EMAIL')}
                            error={loading ? null : errorEmail}
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
                      {(loading) ? <Spinner />
                        : (
                          <>
                            <div>
                              <button
                                className="verifyButton rounded-full w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
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
          </div>
        </div>
        <Footer />
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(OneMVForgotPasswordScreen));
