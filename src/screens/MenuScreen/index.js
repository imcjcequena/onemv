import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import {
  Header,
  ScreenContainer,
  BottomTabNavigation,
  Text,
} from '../../components';

class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Menu Screen',
    };
  }

  componentDidMount = () => {
    const { history, onBoarding } = this.props;
    const user = jwt.decode(localStorage.getItem('userToken'));
    if (!onBoarding) {
      if (user) {
        this.setState({ name: `Hi, ${user.firstName}!` });
      } else {
        history.push('/');
      }
    }
  }

  render = () => {
    const { name } = this.state;
    const { onBoarding } = this.props;
    return (
      <>
        <ScreenContainer className={onBoarding ? 'h-full' : 'h-full'}>
          <Header title={name} showBackNavigation={false} />
          {
            onBoarding
            && ((
              <div className="flex-auto" />
            ))
          }
          {
            !onBoarding
            && ((
              <section className="flex flex-col p-3 flex-grow">
                <Link to="/whatsNew">
                  <button
                    className="w-full font-bold p-3 shadow-xl bg-white rounded-lg mt-4"
                    type="button"
                  >
                    <Text text="WHATS_NEW" />
                  </button>
                </Link>
                <Link to="/policy">
                  <button
                    className="w-full font-bold p-3 shadow-xl bg-white rounded-lg mt-4"
                    type="button"
                  >
                    <Text text="POLICY_PAGE_TITLE" />
                  </button>
                </Link>
                <Link to="/support">
                  <button
                    className="w-full font-bold p-3 shadow-xl bg-white rounded-lg mt-4"
                    type="button"
                  >
                    <Text text="SUPPORT_PAGE_TITLE" />
                  </button>
                </Link>
              </section>
            ))
          }
          <BottomTabNavigation onBoarding={onBoarding} />
        </ScreenContainer>
      </>
    );
  };
}

export default withRouter(MenuScreen);
