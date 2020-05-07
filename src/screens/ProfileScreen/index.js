import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import jwt from 'jsonwebtoken';
import {
  Header,
  Text,
  ScreenContainer,
  BottomTabNavigation,
} from '../../components';
import {
  passengersApiBaseUrl,
  buildRequestHeaders,
} from '../../utils';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  componentDidMount = () => {
    const { history } = this.props;
    const user = jwt.decode(localStorage.getItem('userToken'));
    if (user) {
      this.setState({
        name: `${user.firstName} ${user.lastName}`,
        clientId: user.clientId,
      });
    } else {
      history.push('/');
    }
  }

  signOut = () => {
    const { history, MVStore } = this.props;
    const { clientId } = this.state;
    const deviceToken = localStorage.getItem('device-token');
    if (window.cordova) {
      fetch(`${passengersApiBaseUrl}/passengers/${clientId}/unregisterDevice`, {
        method: 'PUT',
        headers: buildRequestHeaders('passenger'),
        body: JSON.stringify({ deviceToken }),
      })
        .then(res => res.json());
    }
    localStorage.removeItem('idToken');
    localStorage.removeItem('loginSelection');
    localStorage.removeItem('device-push-active');
    MVStore.clear();
    history.replace('/loginSelection');
  }

  render = () => {
    const { name } = this.state;
    const loginSelection = localStorage.getItem('loginSelection');
    return (
      <>
        <Header title={name} showBackNavigation={false} />
        <ScreenContainer className="profileScreen p-3">
          <div className="w-full">
            {loginSelection && loginSelection === 'onemv' && (
              <Link to="/onemvChangePassword">
                <button
                  className="w-full font-bold p-3 shadow-xl bg-white rounded-lg"
                  type="button"
                >
                  <Text text="CHANGE_PASSWORD" />
                </button>
              </Link>
            )}
            <button
              onClick={this.signOut}
              className="w-full font-bold p-3 shadow-xl bg-white rounded-lg mt-4"
              type="button"
            >
              <Text text="SIGN_OUT" />
            </button>
          </div>
        </ScreenContainer>
        <BottomTabNavigation />
      </>
    );
  };
}

export default compose(inject('MVStore'), observer)(withRouter(ProfileScreen));
