/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
// import { isLoggedIn } from '../../utils/index';
import {
  Footer,
  Text,
  Input,
  ScreenContainer,
  ErrorMessage,
} from '../../components';
import {
  divisionsApiBaseUrl,
  query,
  i18n,
  buildRequestHeaders,
} from '../../utils';
import './ServiceSelection.scss';
import logo from '../../assets/images/ic-onemv-logo.svg';

class ServiceSelection extends Component {
  state = {
    divisionId: 0,
    stateId: 0,
    states: [],
    divisions: [],
    errorSelectState: null,
    errorSelectService: null,
    selectStateDisabled: true,
    selectServiceDisabled: true,
    backgroundState: 'bg-gray-250',
    backgroundService: 'bg-gray-250',
    selectStateText: i18n('LOADING'),
    selectServicetext: i18n('LOADING'),
    isCordova: window.cordova,
  }

  // eslint-disable-next-line consistent-return
  componentDidMount = () => {
    const { history, MVStore, onBoarding } = this.props;
    const division = localStorage.getItem('x-division-id');
    const userToken = localStorage.getItem('userToken');
    const idToken = localStorage.getItem('idToken');
    const onBoarded = localStorage.getItem('onBoarded');

    if (!onBoarding) {
      if (!onBoarded) return history.push('/onBoarding');
      if (userToken && idToken && division) return history.push('/home');
      if ((userToken || division) && !idToken) {
        MVStore.clear();
        localStorage.removeItem('userToken');
        localStorage.removeItem('x-division-id');
        localStorage.removeItem('x-division-code');
        localStorage.removeItem('x-division-logo');
        localStorage.removeItem('x-division-logoWhite');
        localStorage.removeItem('email');
      }

      fetch(`${divisionsApiBaseUrl}${query.getStates}`, {
        headers: buildRequestHeaders('division'),
      })
        .then(res => res.json())
        .then((data) => {
          this.setState({
            states: data.data,
            selectStateText: i18n('SELECT_STATE'),
            selectServicetext: i18n('SELECT_SERVICE'),
            backgroundState: 'bg-white',
            backgroundService: 'bg-white',
            selectStateDisabled: false,
          });
        })
        .catch(error => (
          <ErrorMessage
            message={error}
            history={history}
            store={MVStore}
          />
        ));
    }
  }

  onInputChange = (key, value) => {
    // TODO: Optimize setState
    const { isCordova } = this.state;
    const { history, MVStore } = this.props;
    let error;
    switch (key) {
      case 'stateId': {
        this.setState({
          divisionId: 0,
          selectServicetext: i18n('LOADING'),
          selectServiceDisabled: true,
          backgroundService: 'bg-gray-250',
        });
        error = 'errorSelectState';
        fetch(
          `${divisionsApiBaseUrl}${query.getStates}/${value}/divisions?${isCordova ? 'isCordova=true' : ''}`,
          {
            headers: buildRequestHeaders('division'),
          },
        )
          .then(res => res.json())
          .then(data => this.setState({
            divisions: data.data ? data.data : null,
            selectServiceDisabled: false,
            selectServicetext: i18n('SELECT_SERVICE'),
            backgroundService: 'bg-white',
          }))
          .catch(err => (
            <ErrorMessage
              message={err}
              history={history}
              store={MVStore}
            />
          ));
        break;
      }
      case 'divisionId': {
        const { divisions } = this.state;
        const division = divisions.find(x => x._id === value);
        const divisionCode = division ? division.code : 0;
        let divisionLogo = null;
        let divisionLogoWhite = null;
        if (division) {
          divisionLogo = division.logo ? division.logo : null;
          divisionLogoWhite = division.logoWhite ? division.logoWhite : null;
        }

        this.setState({
          divisionId: value,
          divisionCode,
          divisionLogo,
          divisionLogoWhite,
        });
        break;
      }
      default:
        error = 'errorSelectService';
        break;
    }
    this.setState({ [key]: value, [error]: null });
  }

  submit = () => {
    const { history, MVStore } = this.props;
    const {
      stateId,
      divisionId,
      divisionCode,
      divisionLogo,
      divisionLogoWhite,
    } = this.state;
    if (divisionId === 0 || stateId === 0) {
      if (stateId === 0) {
        this.setState({ errorSelectState: i18n('PLEASE_SELECT_A_STATE') });
      }
      if (divisionId === 0) {
        this.setState({ errorSelectService: i18n('PLEASE_SELECT_YOUR_SERVICE') });
      }
    } else {
      localStorage.setItem('x-division-id', divisionId);
      localStorage.setItem('x-division-code', divisionCode);
      if (divisionLogo || divisionLogoWhite) {
        MVStore.setDivisionLogo(divisionLogo);
        MVStore.setDivisionLogoWhite(divisionLogoWhite);
        localStorage.setItem('x-division-logo', divisionLogo);
        localStorage.setItem('x-division-logoWhite', divisionLogoWhite);
      }
      // alert(JSON.stringify(divisionId));
      history.push('/clientVerification');
    }
  }

  componentDidUpdate = () => {
    const { history } = this.props;
    const onBoarded = localStorage.getItem('onBoarded');
    if (!onBoarded) return history.push('/onBoarding');
  }

  render() {
    const {
      divisionId,
      stateId,
      states,
      divisions,
      errorSelectState,
      errorSelectService,
      selectStateDisabled,
      selectServiceDisabled,
      backgroundState,
      backgroundService,
      selectStateText,
      selectServicetext,
    } = this.state;
    const { onBoarding } = this.props;
    return (
      <ScreenContainer className={onBoarding ? 'serviceSelection h-full' : 'serviceSelection'}>
        <h1 className="sr-only">Service Selection Screen</h1>
        <div className="flex flex-col container mx-auto flex-grow">
          <div className="align-center w-half mt-5">
            <img src={logo} alt="OneMV Logo" className="mx-auto py-6" />
          </div>
          <section className="px-5 flex-col flex items-center flex-1 justify-center">
            <div className="w-full">
              {
                !onBoarding
                && ((
                  <>
                    <div className="w-full mb-4 rounded text-gray-900">
                      <Input
                        type="select"
                        aria-label="Select State"
                        className={`w-full ${backgroundState} p-3 rounded-lg appearance-none`}
                        onChange={e => this.onInputChange('stateId', e.target.value)}
                        defaultValue={stateId}
                        error={errorSelectState}
                        disabled={selectStateDisabled}
                      >
                        <option value={0} disabled>{selectStateText}</option>
                        { states && states.map(item => <option aria-label={item.name} value={item._id} key={item._id}>{item.name}</option>)}
                      </Input>
                    </div>
                    <div className="w-full mb-5 rounded">
                      <Input
                        type="select"
                        aria-label="Select Service"
                        className={`w-full ${backgroundService} p-3 rounded-lg appearance-none`}
                        onChange={e => this.onInputChange('divisionId', e.target.value)}
                        defaultValue={divisionId}
                        error={errorSelectService}
                        disabled={selectServiceDisabled}
                      >
                        {/* {divisionId === 0 && <option value={0}>{selectServicetext}</option>} */}
                        <option value={0}>{selectServicetext}</option>
                        {
                          divisions && divisions.map && divisions
                            .map(item => <option aria-label={item.name} value={item._id} key={item._id}>{item.name}</option>)
                        }
                      </Input>
                    </div>
                  </>
                ))
              }
              <div className={onBoarding ? 'pt-48' : ''}>
                <button
                  onClick={this.submit}
                  className={onBoarding ? 'rounded-full max-screen w-full bg-blue-100 text-white py-3 px-4 rounded' : 'rounded-full w-full bg-blue-100 text-white py-3 px-4 rounded'}
                  type="button"
                >
                  <Text text="NEXT" />
                </button>
              </div>
            </div>
          </section>
        </div>
        <Footer className="bg-transparent" />
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(ServiceSelection));
