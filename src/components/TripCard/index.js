/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Card from '../Card';
import Query from '../Query';
import Text from '../Text';
import ErrorMessage from '../ErrorMessage';
import {
  getFormattedDate,
  getDistanceInKM,
  getTimeStr,
  getTripLabel,
} from '../../utils';

class TripCard extends Component {
  state = {
    formattedTripDate: null,
  }

  componentDidMount = async () => {
    const { tripData, dateToday } = this.props;
    const formattedTripDate = await getFormattedDate(tripData.trip_date_display, dateToday);
    this.setState({ formattedTripDate });
  };

  renderCard = (tripData, vehicleData = null) => {
    const { formattedTripDate } = this.state;
    const {
      pickup,
      dropoff,
      is_imminent,
      trip_id,
      trip_status,
    } = tripData;

    let tripLabelCenter = false;
    const tripLabel = getTripLabel(tripData);

    if (tripLabel === 'YOUR_TRIP_HAS_ARRIVED' || tripLabel === 'IN_TRANSIT') {
      tripLabelCenter = true;
    }

    return (
      <Link
        to={{
          pathname: `/trips/details/${trip_id}`,
          state: { imminent: is_imminent && trip_status === 'Scheduled' },
        }}
      >
        <Card className="mb-4">
          <div className="flex tripSchedule">
            {(
              !tripLabelCenter && (
              <div className="text-left align-top">
                {formattedTripDate && formattedTripDate}
                <br />
                {pickup.window_display && pickup.window_display}
              </div>
              )
            )}
            <div className={tripLabelCenter ? 'center w-full' : 'right'}>
              <span className={tripLabelCenter ? 'status font-bold flex items-center justify-center' : 'status font-bold flex items-center'}>
                <div className="text-blue">
                  <Text text={tripLabel} />
                </div>
                <i className="icon-chevron-right text-2xl opacity-50" />
              </span>
              {(
                vehicleData && (
                  <div>
                    <i className="icon-vehicle-pin mx-3" />
                    <span className="plate-number">{(vehicleData ? vehicleData.vehicle.name : '')}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <hr className="border-gray-50 mb-1" />
          <div className="endpoints">
            <ul className="flex">
              <li className="flex-shrink overflow-hidden leading-none">
                <div className="circle mr-2 text-center" />
                <div className="dot">: : : : : : : : : : : :</div>
              </li>
              <li className="flex-1">
                <div className="pickupContainer pb-4">
                  <div className="font-bold capitalize">{pickup.name.trim() !== '' ? pickup.name.toLowerCase() : pickup.street.toLowerCase()}</div>
                </div>
              </li>
            </ul>
            <ul className="flex">
              <li className="flex-shrink overflow-hidden leading-none">
                <i className="icon-location-pin text-xl mr-2 drop" />
              </li>
              <li className="flex-1">
                <div className="pickupContainer">
                  <div className="font-bold capitalize">{dropoff.name.trim() !== '' ? dropoff.name.toLowerCase() : dropoff.street.toLowerCase()}</div>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </Link>
    );
  }

  getTravelTime = (origin, destination) => {
    const locA = {
      lat: origin.coordinates[0],
      lng: origin.coordinates[1],
    };
    const locB = {
      lat: destination.coordinates[1],
      lng: destination.coordinates[0],
    };
    const distance = getDistanceInKM(locA, locB);
    return getTimeStr(distance);
  }

  render = () => {
    const {
      isImminent,
      tripData,
      history,
      MVStore,
    } = this.props;
    return (
      <>
        {
          (isImminent && tripData && tripData.vehicle_id
            ? (
              <Query isPolling={isImminent} url={`/vehicles/${tripData.vehicle_id}/latest-gps`}>
                {(
                  ({ loading, error, data }) => {
                    if (loading) return (<></>);
                    if (error) {
                      return (
                        <ErrorMessage
                          history={history}
                          store={MVStore}
                          message={error}
                        />
                      );
                    }
                    const vehicleData = data && data.data ? data.data[0] : null;
                    return this.renderCard(tripData, vehicleData);
                  }
                )}
              </Query>
            ) : (
              this.renderCard(tripData, null)
            )
          )
        }
      </>
    );
  }
}

TripCard.propTypes = {
  tripData: PropTypes.object,
  isImminent: PropTypes.bool,
};

TripCard.defaultProps = {
  tripData: {},
  isImminent: false,
};

export default compose(inject('MVStore'), observer)(withRouter(TripCard));
