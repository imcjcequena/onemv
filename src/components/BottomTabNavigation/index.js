import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Text from '../Text';
import './BottomTabNavigation.scss';

class FooterMenu extends Component {
  componentDidMount = () => {};

  render = () => {
    const { onBoarding } = this.props;
    return (
      <footer className="footer-menu w-full bottom-0">
        <ul className="flex">
          <li className="flex-1">
            <NavLink
              className="text-center capitalize block py-2 pt-3 text-white"
              activeClassName="active"
              to="/home"
            >
              <i className="icon-mv-home text-xl text-white" />
              <br />
              <Text text="HOME" />
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink
              className="text-center capitalize block text-white py-2 pt-3"
              activeClassName="active"
              to="/trips"
            >
              <i className="icon-vehicle-pin text-xl text-white" />
              <br />
              <Text text="MY_TRIPS" />
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink
              className="text-center block capitalize text-white py-2 pt-3"
              activeClassName="active"
              to="/account"
            >
              <i className="icon-account text-xl text-white" />
              <br />
              <Text text="ACCOUNT" />
            </NavLink>
          </li>
          <li className="flex-1">
            <NavLink
              className={onBoarding ? 'text-center block capitalize text-white py-2 pt-3 active' : 'text-center block capitalize text-white py-2 pt-3'}
              activeClassName="active"
              to="/menu"
            >
              <i className="icon-menu text-xl text-white" />
              <br />
              <Text text="MENU" />
            </NavLink>
          </li>
        </ul>
      </footer>
    );
  };
}

export default withRouter(FooterMenu);
