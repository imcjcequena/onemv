/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import {
  Card,
  StarRatings,
  Query,
  Spinner,
  Text,
} from '../../../components';
import { getFormattedDate, getTripLabel, i18n } from '../../../utils';

class TripDetailsContainer extends Component {
  state = {
    rating: 0,
  };

  componentDidMount = async () => {
    const { tripData } = this.props;
    const formattedTripDate = await getFormattedDate(tripData.trip_date_display);
    this.setState({ formattedTripDate });
  }

  setRating = (value) => {
    const { tripData, history } = this.props;
    this.setState({ rating: value });
    history.push({
      pathname: `/trips/${tripData.trip_id}/ratings`,
      // eslint-disable-next-line no-underscore-dangle
      state: { rating: value, tripId: tripData.trip_id, trip_id: tripData._id },
    });
  }

  render() {
    const { tripData, vehicleData, MVStore } = this.props;
    const { passengerId } = MVStore.profile;
    const { rating, formattedTripDate } = this.state;
    const {
      pickup,
      dropoff,
      is_imminent,
      trip_id,
      trip_status,
      mobility_aids,
      _id,
    } = tripData;

    let showETA = false;
    const tripLabel = getTripLabel(tripData);

    if (tripLabel === 'IN_TRANSIT') {
      showETA = true;
    }


    return (
      <section
        className={trip_status === 'Completed' ? 'flex flex-col flex-grow bg-white' : 'flex flex-col p-3 flex-grow'}
      >
        <div className="flex flex-col flex-grow">
          <div className="mb-5 flex-grow">
            <div className={trip_status === 'Completed' ? 'flex mb-3 p-3 bg-gray-100' : 'flex mb-3'}>
              <div className="text-left">
                {formattedTripDate}
                <br />
                {pickup.window_display}
              </div>
              <div className="right">
                <span className="status font-bold">
                  <Text text={tripLabel} />
                </span>
                <br />
                {vehicleData
                  && trip_status === 'Scheduled'
                  && vehicleData.vehicle
                  && vehicleData.vehicle.name
                  && (
                    <div>
                      <i className="icon-vehicle-pin mx-2" />
                      <span className="plate-number">{vehicleData.vehicle.name}</span>
                    </div>
                  )
                }
              </div>
            </div>
            <div className={trip_status === 'Completed' ? 'endpoints p-3' : 'endpoints'}>
              <ul className="flex">
                <li className="flex-shrink overflow-hidden leading-none">
                  <div className="circle mr-2 text-center" />
                  <div className="dot ml-1">: : : : : : : : : : : :</div>
                </li>
                <li className="flex-1">
                  <div className="pickupContainer pb-4">
                    <div className="font-bold capitalize">{pickup.name.trim() !== '' ? pickup.name.toLowerCase() : pickup.street.toLowerCase()}</div>
                    <div className="capitalize">
                      {`${pickup.suite} ${pickup.street.toLowerCase()} ${pickup.city.toLowerCase()}, ${pickup.state} ${pickup.zip}`}
                    </div>
                    <div className="text-gray-400">
                      {pickup.actualArrivalTimeDisplay && `${pickup.actualArrivalTimeDisplay} ${i18n('ARRIVED')}`}
                    </div>
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
                    <div className="capitalize">
                      {`${dropoff.suite} ${dropoff.street.toLowerCase()} ${dropoff.city.toLowerCase()}, ${dropoff.state} ${dropoff.zip}`}
                    </div>
                    {
                      (dropoff.estimatedArrivalTimeDisplay && showETA)
                      && <div className="font-bold">{`${dropoff.estimatedArrivalTimeDisplay} ${i18n('ESTIMATED_TIME_OF_ARRIVAL')}`}</div>
                    }
                    {
                      ((trip_status === 'Completed') && dropoff.actualArrivalTimeDisplay)
                      && <div className="text-gray-400">{`${dropoff.actualArrivalTimeDisplay} ${i18n('ARRIVED')}`}</div>
                    }
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="sticky bottom-0">
            <div className={trip_status === 'Completed' ? 'w-100 p-3' : 'w-100'}>
              <Card className={trip_status === 'Completed' ? 'bg-gray-100 shadow-none' : ''}>
                {(is_imminent && trip_status !== 'Completed' && <h2 className="font-bold text-lg text-blue">{dropoff.estimatedArrivalTimeDisplay && `${dropoff.estimatedArrivalTimeDisplay} ETA`}</h2>)}
                {(!is_imminent
                  && trip_status !== 'Completed'
                  && (
                    <h2 className="font-bold text-lg capitalize text-blue">
                      {pickup.name.trim() !== '' ? pickup.name.toLowerCase() : pickup.street.toLowerCase()}
                    </h2>
                  )
                  )}
                <div className="text-gray-900">
                  <div className="flex px-1 text-left items-center">
                    <div className="mr-3 opacity-50"><i className="icon-passenger" /></div>
                    <div className="flex-grow">
                      <Text text="PASSENGER" />
                    </div>
                    <div>1</div>
                  </div>
                  {(
                    mobility_aids.trim() !== ''
                    && (
                      <div className="flex px-1 text-left items-center">
                        <div className="mr-3 opacity-50"><i className="icon-mobility-aid" /></div>
                        <div className="flex-grow">
                          <Text text="MOBILITY_AIDS" />
                        </div>
                        <div>
                          {
                            mobility_aids.split(',').map((str) => {
                              switch (str) {
                                case 'CAN': return <i key={str} className="icon-cane" />;
                                case 'LFT': return <i key={str} className="icon-lift" />;
                                case 'WLK': return <i key={str} className="icon-walker" />;
                                case 'OXY': return <i key={str} className="icon-oxygen" />;
                                case 'CRT': return <i key={str} className="icon-crutches" />;
                                default:
                              }
                              return <div key={str} />;
                            })
                          }
                        </div>
                      </div>
                    )
                  )}
                  <div className="flex px-1 text-left items-center">
                    <div className="mr-3 opacity-50"><i className="icon-confirmation-number" /></div>
                    <div className="flex-grow">
                      <Text text="CONFIRMATION_NO" />
                    </div>
                    <div>{trip_id}</div>
                  </div>
                </div>
              </Card>
            </div>
            {((trip_status === 'Completed')
              && (
                <Query url={`/trips/${_id}/ratings`}>
                  {
                    ({ loading, error, data }) => {
                      if (loading) return <Spinner />;
                      if (error && error.message === 'Trip not found') return <StarRatings onClick={this.setRating} ratings={rating} className="mx-auto w-3/4 text-4xl p-3 px-5" />;
                      if (data && data.success) {
                        const { ratings } = data.data;
                        return ratings.map((rating_item) => {
                          if (parseInt(rating_item.passengerId, 10) === parseInt(passengerId, 10)) {
                            return (
                              <div key={rating_item.passengerId} className="p-3 text-left break-words">
                                <hr />
                                <div className="w-100 flex items-center">
                                  <StarRatings ratings={rating_item.rating} className="mx-auto w-3/4 text-4xl p-3 px-5" />
                                </div>
                                {(rating_item.comments && <div className="text-left">{rating_item.comments}</div>)}
                              </div>
                            );
                          }
                          return <></>;
                        });
                      }
                      return <StarRatings onClick={this.setRating} ratings={rating} className="mx-auto w-3/4 text-4xl p-3 px-5" />;
                    }
                  }
                </Query>
              )
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(TripDetailsContainer));
