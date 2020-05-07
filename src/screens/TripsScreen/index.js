import React, { Component } from 'react';
import {
  withRouter,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom';
import {
  ScreenContainer,
  Header,
  BottomTabNavigation,
  Text,
} from '../../components';
import TodayScreen from './TodayScreen';
import RecentScreen from './RecentScreen';
import FutureScreen from './FutureScreen';
import './TripsScreen.scss';

class TripsScreen extends Component {
  componentDidMount = () => { }

  render() {
    const { location, onBoarding } = this.props;
    return (
      <>
        <ScreenContainer className={onBoarding ? 'h-full' : ''}>
          <Header className="justify-between" showBackNavigation={false}>
            <div className="text-center w-full text-white font-bold">
              <ul className="flex w-full">
                <li className="flex-1">
                  <NavLink
                    className={ onBoarding ? 'block rounded-full py-1 px-3 active' : 'block rounded-full py-1 px-3' }
                    to="/trips/today"
                    isActive={() => ['/trips', '/trips/today'].includes(location.pathname)}
                    activeClassName="active"
                  >
                    <Text text="TODAY" />
                  </NavLink>
                </li>
                <li className="flex-1">
                  <NavLink className="block rounded-full py-1 px-3" to="/trips/future" activeClassName="active"><Text text="FUTURE" /></NavLink>
                </li>
                <li className="flex-1">
                  <NavLink className="block rounded-full py-1 px-3" to="/trips/recent" activeClassName="active"><Text text="RECENT" /></NavLink>
                </li>
              </ul>
            </div>
          </Header>
          {
            !onBoarding
            && ((
              <section className="flex flex-col p-3 flex-grow listContainer">
                <h1 className="sr-only">Trips Screen</h1>
                <Switch>
                  <Route path="/trips/today" component={TodayScreen} />
                  <Route path="/trips/future" component={FutureScreen} />
                  <Route path="/trips/recent" component={RecentScreen} />
                  <Route path="/trips" component={TodayScreen} />
                </Switch>
              </section>
            ))
          }
          {
            onBoarding
            && ((
              <div className="placeholder-div w-full h-full" />
            ))
          }
          <BottomTabNavigation />
        </ScreenContainer>
      </>
    );
  }
}

export default withRouter(TripsScreen);
