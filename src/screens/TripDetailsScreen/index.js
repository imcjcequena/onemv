/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import {
  ScreenContainer,
  Header,
  Query,
  ErrorMessage,
  Spinner,
} from '../../components';
import TripDetailsContainer from './TripDetailsContainer';
import MapViewContainer from './MapViewContainer';
import { i18n } from '../../utils';
import trip_view from '../../assets/images/trip-view.png';
import map_view from '../../assets/images/map-view.png';
import './TripDetailsScreen.scss';


class TripDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      showMap: false,
    };
  }

  renderComponent = (tripData, vehicleData = null) => {
    const { showMap } = this.state;
    return (
      <>
        {(showMap && <MapViewContainer vehicleData={vehicleData} tripData={tripData} />)}
        {(
          (tripData.trip_status !== 'Completed')
          && (
            <button
              type="button"
              onClick={() => this.setState({ showMap: !showMap })}
              className="uppercase flex items-center justify-center shadow-lg p-2 bg-white"
            >
              {showMap ? i18n('TRIP_OVERVIEW') : i18n('MAP_VIEW')}
              <i className={showMap ? 'icon-chevron-up text-xl text-black' : 'icon-chevron-down text-xl text-black'} />
            </button>
          )
        )}
        {(!showMap && <TripDetailsContainer vehicleData={vehicleData} tripData={tripData} />)}
      </>
    );
  }

  render = () => {
    const { id } = this.state;
    const {
      location, history, MVStore, onBoarding, tripView, mapView,
    } = this.props;
    let imminent = null;
    if (location.state) {
      const { imminent: isImminent } = location.state;
      imminent = isImminent;
    }


    return (
      <ScreenContainer className={onBoarding ? 'h-full overflow-hidden' : ''}>
        <Header title={i18n('TRIP_DETAILS')} />
        {
          mapView
          && ((
            <div className="w-full">
              <img src={map_view} alt="map_view" className="m-auto max-bg-img " />
            </div>
          ))
        }
        {
          tripView
          && ((
            <div className="w-full">
              <img src={trip_view} alt="trip_view" className="m-auto max-bg-img " />
            </div>
          ))
        }
        {
          !onBoarding
          && ((
            <Query pollingInterval={15000} isPolling={imminent} url={`/trips/${id}`}>
              {
                ({ loading: parentLoading, error: parentError, data: parentData }) => {
                  if (parentError) {
                    return (
                      <ErrorMessage
                        message={parentError}
                        history={history}
                        store={MVStore}
                        className="h-full text-lg font-bold flex items-center justify-center text-center"
                      />
                    );
                  }
                  if (parentLoading) {
                    return (
                      <Spinner />
                    );
                  }
                  const tripData = parentData.data;
                  if (!tripData) {
                    return <ErrorMessage className="h-full text-lg font-bold flex items-center justify-center text-center" />;
                  }
                  return (
                    <>
                      {tripData && tripData.is_imminent && tripData.vehicle_id && tripData.trip_status === 'Scheduled'
                        && (
                          <Query isPolling pollingInterval={15000} url={`/vehicles/${tripData.vehicle_id}/latest-gps`}>
                            {
                              ({ loading, error, data }) => {
                                if (loading) {
                                  return (
                                    <Spinner />
                                  );
                                }
                                if (error) {
                                  return (
                                    <ErrorMessage
                                      message={error}
                                      history={history}
                                      store={MVStore}
                                      className="h-full text-lg font-bold flex items-center justify-center text-center"
                                    />
                                  );
                                }
                                if (data.success) {
                                  const vehicleData = data.data[0];
                                  return this.renderComponent(tripData, vehicleData);
                                }
                                return this.renderComponent(tripData);
                              }
                            }
                          </Query>
                        )
                      }

                      {tripData && tripData.is_imminent && !tripData.vehicle_id && tripData.trip_status === 'Scheduled' && this.renderComponent(tripData)}
                      {(!tripData.is_imminent) && this.renderComponent(tripData)}
                    </>
                  );
                }
              }
            </Query>
          ))
        }
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(TripDetailsScreen));
