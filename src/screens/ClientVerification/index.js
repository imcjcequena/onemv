/* eslint-disable label-has-associated-control, jsx-a11y/label-has-for, consistent-return */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import { i18n, buildRequestHeaders, divisionsApiBaseUrl } from '../../utils';
import {
  ScreenContainer,
  Header,
  Mutation,
  Card,
  Footer,
  Label,
  Input,
  Spinner,
  Text,
} from '../../components';
import './ClientVerification.scss';

class ClientVerification extends Component {
  state = {
    clientId: '',
    dob: '',
    dateOfBirth: '',
    errorClientId: null,
    errorDOB: null,
    contactSupport: null,
    provider: null,
    providerId: null,
    dateValues: {
      month: '',
      year: '',
      day: '',
    },
    divisionFields: [],
  }

  componentDidMount = async () => {
    const { location, history } = this.props;

    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');

    await this.getDivisionFields();

    if (userToken && idToken && division) return history.push('/home');

    if (!division) return history.push('/');

    // Check if has routes states (provider credentials) from LoginSelection
    if (location.state && location.state.provider === 'google') {
      const googleUserData = jwt.decode(location.state.data.id_token);
      this.setState({
        providerId: googleUserData.sub,
        provider: location.state.provider,
      });
    }
  }

  getDivisionFields = async () => {
    const division = localStorage.getItem('x-division-id');
    const params = await fetch(
      `${divisionsApiBaseUrl}/divisions/${division}/parameters`,
      { headers: buildRequestHeaders('division') },
    ).then(res => res.json());
    const fields = params.data.find(x => x.key === 'verification-fields');
    this.setState({ divisionFields: fields.value.split(', ') });
  }

  validate = () => new Promise((resolve) => {
    this.setState({ errorDOB: null, errorClientId: null, contactSupport: null });
    const { dob, clientId } = this.state;
    if (this.divisionHasField('clientId') && clientId.length < 1) return this.setState({ errorClientId: i18n('REQUIRED') }, () => resolve(false));
    if (this.divisionHasField('dob') && dob.length < 1) return this.setState({ errorDOB: i18n('REQUIRED') }, () => resolve(false));
    return this.setState({ errorDOB: null, errorClientId: null }, () => resolve(true));
  })

  submit = async (e, verifyClient, authenticateClient, registerDevice = null) => {
    e.preventDefault();
    const isValidated = await this.validate();
    const { history, MVStore } = this.props;
    const {
      provider,
      providerId,
    } = this.state;
    if (isValidated) {
      try {
        const result = await verifyClient();
        if (result && result.success) {
          const userData = {
            dateOfBirth: result.data.dob,
            firstName: result.data.first_name,
            lastName: result.data.last_name,
            middleName: result.data.middle_name,
            passengerId: result.data.passenger_id,
            provider,
            providerId,
          };
          const authenticate = await authenticateClient(userData);
          if (authenticate && authenticate.success) {
            localStorage.setItem('userToken', authenticate.data);
            localStorage.setItem('userHasLoggedIn', 'true');
            MVStore.setProfile(userData);
            if (registerDevice && window.cordova) {
              const data = {
                deviceToken: localStorage.getItem('device-token'),
              };
              const device = await registerDevice(data);
              if (device && device.success) {
                localStorage.setItem('device-push-active', true);
              }
            }
            history.push('/loginSelection');
          }
        } else {
          let error;
          let contact;
          if (result.message === 'Login Provider already used') {
            error = i18n('INVALID_ACCOUNT');
            contact = null;
          } else {
            error = i18n('YOUR_CLIENT_ID_OR_BIRTH_DATE_IS_INVALID') + i18n('PLEASE_TRY_AGAIN');
            contact = i18n('CONTACT_CUSTOMER_SUPPORT');
          }
          this.setState({
            errorClientId: '',
            errorDOB: error,
            contactSupport: contact,
          });
        }
      } catch (error) {
        this.setState({
          contactSupport: i18n('CONTACT_CUSTOMER_SUPPORT'),
        });
      }
    }
  }

  getDOB = () => {
    const { dateValues } = this.state;
    const { month, day, year } = dateValues;
    let monthStr = month;
    let dayStr = day;
    if (month < 10 && month.length < 2) {
      monthStr = `0${month}`;
    }
    if (day < 10 && day.length < 2) {
      dayStr = `0${day}`;
    }
    this.setState({
      dateOfBirth: `${year}${monthStr}${dayStr}`,
      dob: `${monthStr}-${dayStr}-${year}`,
    });
  }

  handleDateChange = (key, event, nextEl) => {
    const { value } = event.target;
    const { dateValues } = this.state;
    switch (key) {
      case 'month': {
        if (value > -1 && value <= 12 && value.length <= 2) {
          dateValues.month = value;
          this.setState({ dateValues }, this.getDOB());
          if (value.length > 1) {
            nextEl.focus();
          }
        }
        break;
      }
      case 'day': {
        if (value > -1 && value <= 31 && value.length <= 2) {
          dateValues.day = value;
          this.setState({ dateValues }, this.getDOB());
          if (value.length > 1) {
            nextEl.focus();
          }
        }
        break;
      }
      case 'year': {
        if (value > -1 && value <= 9999 && value.length <= 4) {
          dateValues.year = value;
          this.setState({ dateValues }, this.getDOB());
        }
        break;
      }
      default:
    }
  };

  onInputChange = (key, value) => {
    this.setState({ errorDOB: null, errorClientId: null, contactSupport: null });
    // * Hard coded date. Missing: Date format
    if (key === 'dob') {
      const date = value.split('-');
      const dateOfBirth = parseInt(`${date[0]}${date[1]}${date[2]}`, 10);
      this.setState({ dateOfBirth });
      this.setState({ [key]: value });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (value.length < 11) {
        if (this.checkNumber(value)) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  checkNumber = (value) => {
    const reg = /^[0-9]+$|^$/;
    return reg.test(value);
  }

  divisionHasField = (fieldName) => {
    const { divisionFields } = this.state;
    return divisionFields.includes(fieldName);
  }

  renderForm = (registerDevice = null) => {
    const {
      clientId,
      dateOfBirth,
      errorClientId,
      errorDOB,
      contactSupport,
      dateValues,
      provider,
      providerId,
      divisionFields,
    } = this.state;

    return (
      <Mutation
        url={`/passengers/${clientId}/verify/`}
        method="PUT"
      >
        {
          ((authenticateClient, { error: authenticateClientError, loading: authenticateClientLoading }) => (
            <Mutation
              url={`/passengers/${clientId}/verify/?dateOfBirth=${dateOfBirth}&provider=${provider}&providerId=${providerId}`}
              method="GET"
            >
              {
                (verifyClient, { error: verifyClientError, loading: verifyClientLoading }) => {
                  const error = verifyClientError || authenticateClientError;
                  const loading = verifyClientLoading || authenticateClientLoading;
                  const background = loading ? 'bg-gray-250' : 'bg-gray-200';
                  return (
                    <ScreenContainer className="clientVerification">
                      <Header path="/" title={i18n('CLIENT_VERIFICATION')} />
                      <div className="content-container mx-5 flex-grow">
                        <form onSubmit={e => this.submit(e, verifyClient, authenticateClient, registerDevice)}>
                          <Card className="my-6 p-4">
                            {(divisionFields.length === 0) && <Spinner />}
                            {(this.divisionHasField('clientId'))
                              && (
                                <div className="mb-3">
                                  <Label className="block text-left" htmlFor="clientId">
                                    <Text text="CLIENT_ID" />
                                  </Label>
                                  <Input
                                    onChange={e => this.onInputChange('clientId', e.target.value)}
                                    className={`border rounded w-full ${background} py-2 px-3 focus:outline-none focus:shadow-outline`}
                                    id="clientId"
                                    name="clientId"
                                    value={clientId}
                                    type="text"
                                    placeholder={i18n('VERIFICATION_NUMBER')}
                                    error={errorClientId}
                                    disabled={loading}
                                  />
                                </div>
                              )
                            }
                            {(this.divisionHasField('dob'))
                              && (
                              <div className="mb-3">
                                <Label className="block text-left" htmlFor="dob">
                                  <Text text="DATE_OF_BIRTH" />
                                </Label>
                                <Input
                                  className={`border rounded w-full px-3 ${background} focus:outline-none focus:shadow-outline`}
                                  name="dateOfBirth"
                                  id="dob"
                                  value={dateValues}
                                  onChange={(key, event, nextEl) => this.handleDateChange(key, event, nextEl)}
                                  type="dateinput"
                                  placeholder={i18n('DATE_PLACEHOLDER')}
                                  error={errorDOB}
                                  max="9999-01-01"
                                  disabled={loading}
                                />
                              </div>
                              )
                            }
                            <div>
                              {
                                (authenticateClientError || verifyClientError) && (
                                  <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                                    <i className="icon-error self-center text-lg mr-2" />
                                    <span>{error}</span>
                                  </div>
                                )
                              }
                            </div>
                            <div>
                              {(
                                (contactSupport || authenticateClientError || verifyClientError)
                                && (
                                  <Link to="/support">
                                    <div className="text-blue text-lg p-2 text-center mt-4">
                                      <Text text="CONTACT_CUSTOMER_SUPPORT" />
                                      <i className="icon-arrow-forward text-base" />
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </Card>
                          {
                            (authenticateClientLoading || verifyClientLoading) ? <Spinner /> : (
                              <button
                                className="verifyButton rounded-full w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                                type="submit"
                              >
                                <Text text="VERIFY" />
                              </button>
                            )
                          }
                        </form>
                      </div>
                      <Footer withLink />
                    </ScreenContainer>
                  );
                }
              }
            </Mutation>
          ))
        }
      </Mutation>
    );
  }

  render() {
    const { clientId } = this.state;
    return (
      <>
        {
          (window.cordova && localStorage.getItem('device-token'))
          && (
            <Mutation
              url={`/passengers/${clientId}/registerDevice/`}
              method="PUT"
            >
              {
                (registerDevice, { error, loading }) => (
                  <>
                    {this.renderForm(registerDevice)}
                    {
                      (error) && (
                        <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                          <i className="icon-error self-center text-lg mr-2" />
                          <span>{error}</span>
                        </div>
                      )
                    }
                    {
                      (loading) && <Spinner />
                    }
                  </>
                )
              }
            </Mutation>
          )
        }
        {(!window.cordova) && this.renderForm()}
      </>
    );
  }
}
export default compose(inject('MVStore'), observer)(withRouter(ClientVerification));
