import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Header,
  Card,
  ScreenContainer,
} from '../../../components';
import { i18n } from '../../../utils';
import './Success.scss';
import logo from '../../../assets/images/ic-onemv-logo.svg';

class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: i18n('SUCCESS'),
    };
  }

  componentDidMount = () => {
    const { history } = this.props;
    setTimeout(() => {
      history.push('/home');
    }, 2000);
  }

  onInputChange = (key, value) => {
    this.setState({ [key]: value });
  }

  render = () => {
    const { location } = this.props;
    const {
      name,
    } = this.state;
    return (
      <ScreenContainer className="registrationSelection">
        <Header showBackNavigation={false}>
          <img src={logo} alt={name} className="w-10 h-6 text-center flex-grow" />
        </Header>
        <div className="block flex-col container mx-auto flex-grow">
          <div className="content-container mx-5 flex-grow">
            <Card className="my-6 p-4">
              <i className="icon-succees text-6xl success" />
              {
                location.state.message && (
                  <div className="text-2xl m-4">
                    {location.state.message}
                  </div>
                )
              }
              {location.state.subMessage && <div className="m-4 italic">{location.state.subMessage}</div>}
            </Card>
          </div>
        </div>
      </ScreenContainer>
    );
  }
}
export default withRouter(Success);
