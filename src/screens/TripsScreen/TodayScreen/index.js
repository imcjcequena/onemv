/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import {
  Card,
  Query,
  TripCard,
  ErrorMessage,
  Text,
  Spinner,
} from '../../../components';
import { isObjectEmpty, getTodayFromDivision } from '../../../utils';

class TodayScreen extends Component {
  state = {
    dateToday: null,
  };

  componentDidMount = async () => {
    const divisionId = localStorage.getItem('x-division-id');
    const dateToday = await getTodayFromDivision(divisionId, 'MM/DD/YYYY');
    this.setState({ dateToday });
  };

  render = () => {
    const { MVStore, history } = this.props;
    const { dateToday } = this.state;
    let passengerId = null;
    if (MVStore.profile) {
      const { passengerId: pid } = MVStore.profile;
      passengerId = pid;
    }

    return (passengerId
      && (
        <Query isPolling url={`/passengers/${passengerId}/trips?filter[schedule]=today&filter[tripStatus]=Scheduled,Unscheduled&sort=pickup.start_window`}>
          {
            ({
              loading,
              error,
              data,
              refetch,
            }) => {
              if (loading) {
                return (
                  MVStore.todayTrips ? MVStore.todayTrips.map(
                    item => (
                      <TripCard
                        isImminent={item.is_imminent && item.trip_status === 'Scheduled'}
                        key={item.trip_id}
                        tripData={item}
                        dateToday={dateToday}
                      />
                    ),
                  ) : (
                    <Spinner />
                  )
                );
              }
              if (error) {
                return (
                  <ErrorMessage
                    message={error}
                    history={history}
                    store={MVStore}
                    className="h-full text-lg font-bold flex items-center justify-center text-center"
                    onClick={() => refetch()}
                  />
                );
              }
              const trips = data.data;
              if (isObjectEmpty(trips) || trips.length === 0) {
                return (
                  <div className="h-full flex items-center justify-center text-center">
                    <Card className="h-32">
                      <div className="h-full font-bold flex items-center justify-center text-center">
                        <Text text="YOU_HAVE_NO_RESERVATIONS_FOR_TODAY" />
                      </div>
                    </Card>
                  </div>
                );
              }
              MVStore.setTodayTrips(trips);
              return trips.map(item => (
                <TripCard
                  isImminent={item.is_imminent && item.trip_status === 'Scheduled'}
                  key={item.trip_id}
                  tripData={item}
                  dateToday={dateToday}
                />
              ));
            }
          }
        </Query>
      )
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(TodayScreen));
