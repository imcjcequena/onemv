/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import jwt from 'jsonwebtoken';
import {
  Header,
  ScreenContainer,
  Card,
  TripCard,
  Query,
  Text,
  ErrorMessage,
  Spinner,
  BottomTabNavigation,
} from '../../components';
import {
  isObjectEmpty,
  getTodayFromDivision,
  buildRequestHeaders,
  passengersApiBaseUrl,
} from '../../utils';
import './HomeScreen.scss';

class HomeScreen extends Component {
  state = {
    dateToday: null,
  };

  renderMyTrips = () => (
    <Link to="/trips">
      <Card className="my-trips flex-grow flex items-center">
        <div className="flex items-center flex-grow">
          <i className="icon-my-trips text-blue mr-2 text-3xl" />
          <Text text="MY_TRIPS" />
        </div>
        <div>
          <i className="icon-chevron-right text-2xl opacity-50" />
        </div>
      </Card>
    </Link>
  );

  componentDidMount = async () => {
    const divisionId = localStorage.getItem('x-division-id');
    const dateToday = await getTodayFromDivision(divisionId, 'MM/DD/YYYY');
    const deviceToken = localStorage.getItem('device-token');
    const user = jwt.decode(localStorage.getItem('userToken'));
    this.setState({ dateToday });
    if (window.cordova && !localStorage.getItem('device-push-active')) {
      fetch(`${passengersApiBaseUrl}/passengers/${user.passengerId}/registerDevice`, {
        method: 'PUT',
        headers: buildRequestHeaders('passenger'),
        body: JSON.stringify({ deviceToken }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem('device-push-active', true);
          }
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const { MVStore, history } = this.props;
    const { dateToday } = this.state;
    let passengerId = null;
    let firstName = '';
    if (MVStore.profile) {
      const { passengerId: pid, firstName: fname } = MVStore.profile;
      passengerId = pid;
      firstName = fname;
    }
    return (
      <>
        <Header
          showBackNavigation={false}
          title={`Hi, ${firstName}!`}
        />
        <ScreenContainer>
          <section className="flex flex-col p-3 flex-grow">
            {(
              passengerId
              && (
                <Query isPolling url={`/passengers/${passengerId}/trips/next`}>
                  {
                    ({
                      loading,
                      error,
                      data,
                      refetch,
                    }) => {
                      if (error) {
                        return (
                          <div className="homeContainer">
                            <ErrorMessage
                              message={error}
                              store={MVStore}
                              history={history}
                              className="h-full text-lg font-bold flex items-center justify-center text-center"
                              onClick={() => refetch()}
                            />
                          </div>
                        );
                      }
                      if (loading) {
                        return (MVStore.nextTrip ? (
                          <>
                            <TripCard
                              tripData={MVStore.nextTrip}
                              isImminent={MVStore.nextTrip.is_imminent}
                              dateToday={dateToday}
                            />
                            {this.renderMyTrips()}
                          </>
                        )
                          : (
                            <Spinner />
                          )
                        );
                      }
                      const tripData = data.data;
                      if (isObjectEmpty(tripData) || tripData.length === 0) {
                        return (
                          <>
                            <div className="h-full flex items-center justify-center text-center">
                              <Card className="h-32 mb-4">
                                <div className="h-full font-bold flex items-center justify-center text-center">
                                  <Text text="YOU_HAVE_NO_RESERVATIONS_FOR_TODAY" />
                                </div>
                              </Card>
                            </div>
                            {this.renderMyTrips()}
                          </>
                        );
                      }
                      MVStore.setNextTrip(tripData);
                      return (
                        <>
                          <TripCard
                            isImminent={tripData.is_imminent}
                            tripData={tripData}
                            dateToday={dateToday}
                          />
                          {this.renderMyTrips()}
                        </>
                      );
                    }
                  }
                </Query>
              )
            )}
          </section>
          <BottomTabNavigation />
        </ScreenContainer>
      </>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(HomeScreen));
