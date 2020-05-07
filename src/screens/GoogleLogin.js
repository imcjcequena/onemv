import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { GoogleSignIn, ScreenContainer } from '../components';
import { queryParamsToObject } from '../utils';

class GoogleLogin extends Component {
  componentWillMount = () => {
    const { location, history } = this.props;
    // if google validation
    const queryParams = queryParamsToObject(location.search);
    if (queryParams.code) {
      history.push(`/clientVerification${location.search}`);
    }
  }

  render() {
    return (
      <ScreenContainer>
        <GoogleSignIn />
        <Link to="/clientVerification">Skip</Link>
      </ScreenContainer>
    );
  }
}

export default withRouter(GoogleLogin);
