/* global google */
/* eslint-disable camelcase */
/* eslint-disable no-unneeded-ternary */
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { withRouter } from 'react-router-dom';
import { Card, Text } from '../../../components';
import { getFormattedDate, getDistanceInKM, getTripLabel } from '../../../utils';
import MapPin from './MapPin';
import './MapViewContainer.scss';

class MapViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRadius: false,
      circleRadius: 0,
      defaultCenter: {
        lat: 27.800583,
        lng: -97.396378,
      },
      mapHeight: window.innerHeight - 154,
      center: {
        lat: 27.800583,
        lng: -97.396378,
      },
      zoom: 9,
    };
  }

  handleResize = () => {
    const mapHeight = window.innerHeight - 154;
    this.setState({ mapHeight });
  }

  componentDidMount = async () => {
    const { tripData, vehicleData } = this.props;

    const { pickup, dropoff } = tripData;

    const pickupCoordinates = {
      lat: pickup.location.coordinates[1],
      lng: pickup.location.coordinates[0],
    };
    const dropOffCoordinates = {
      lat: dropoff.location.coordinates[1],
      lng: dropoff.location.coordinates[0],
    };
    let vehicleCoordinates = null;
    if (vehicleData) {
      vehicleCoordinates = {
        lat: vehicleData.location.coordinates[0],
        lng: vehicleData.location.coordinates[1],
      };
    }

    this.setLabel(tripData);
    window.addEventListener('resize', () => this.handleResize());
    const formattedDate = await getFormattedDate(tripData.trip_date_display);
    this.setState({
      pickupCoordinates,
      dropOffCoordinates,
      vehicleCoordinates,
      formattedDate,
    }, () => {
      if (vehicleData) {
        this.setState({ circleRadius: this.getRadius(vehicleData) });
      }
    });
  }

  componentWillUnmount = () => window.removeEventListener('resize', () => this.handleResize());

  setBounds = (coordinate1, coordinate2, mapObj = null) => {
    const { map } = this.state;
    const mapItem = mapObj === null ? map : mapObj;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(coordinate1);
    bounds.extend(coordinate2);
    mapItem.fitBounds(bounds);
    mapItem.panBy(0, 80);
    const zoom = mapItem.getZoom();
    mapItem.setZoom(zoom - 1.5);
  };

  laodMapInfo = (map, maps, center, circleRadius, showRadius) => {
    const { vehicleData } = this.props;
    const { pickupCoordinates, dropOffCoordinates } = this.state;

    let radius = 0;
    if (vehicleData && showRadius) {
      radius = circleRadius;
      const vehicleCoordinates = {
        lat: vehicleData.location.coordinates[0],
        lng: vehicleData.location.coordinates[1],
      };
      this.setBounds(vehicleCoordinates, pickupCoordinates, map);
    } else {
      this.setBounds(dropOffCoordinates, pickupCoordinates, map);
    }

    const circleObj = new google.maps.Circle({
      strokeColor: '#248086',
      strokeOpacity: 0,
      strokeWeight: 2,
      fillColor: '#248086',
      fillOpacity: 0.25,
      map,
      center,
      radius,
    });
    this.setState({ circleObj, showRadius, map });
  }

  setLabel = (tripData, cb = null) => {
    const tripLabel = getTripLabel(tripData);
    let showRadius = false;
    if (
      tripLabel !== 'YOUR_TRIP_HAS_ARRIVED'
      && tripLabel !== 'IN_TRANSIT'
      && tripLabel !== 'COMPLETED'
      && tripLabel !== 'CANCELED'
      && tripLabel !== 'NO_SHOW'
    ) {
      showRadius = true;
    }
    this.setState({ showRadius, tripLabel }, cb);
  }

  componentWillReceiveProps = () => {
    const { vehicleData, tripData } = this.props;
    const {
      circleObj,
      showRadius,
      pickupCoordinates,
      dropOffCoordinates,
    } = this.state;

    if (!vehicleData) return;

    const vehicleCoordinates = {
      lat: vehicleData.location.coordinates[0],
      lng: vehicleData.location.coordinates[1],
    };

    this.setLabel(tripData, () => {
      try {
        if (window.google && showRadius) {
          circleObj.setRadius(this.getRadius(vehicleData));
          this.setBounds(vehicleCoordinates, pickupCoordinates);
        } else if (circleObj) {
          this.setBounds(dropOffCoordinates, pickupCoordinates);
          circleObj.setVisible(false);
        }
      } catch (error) {
        console.log(error);
      }
    });
    this.setState({ vehicleCoordinates });
  }

  getRadius = (vehicleData) => {
    const { history } = this.props;
    const { pickupCoordinates } = this.state;
    if (!vehicleData) {
      history.goBack();
    }
    const vehicleCoordinates = {
      lat: vehicleData.location.coordinates[0],
      lng: vehicleData.location.coordinates[1],
    };
    return Math.ceil(getDistanceInKM(vehicleCoordinates, pickupCoordinates) * 1000);
  }

  render = () => {
    const {
      pickupCoordinates,
      dropOffCoordinates,
      vehicleCoordinates,
      defaultCenter,
      circleRadius,
      formattedDate,
      center,
      mapHeight,
      zoom,
      showRadius,
      tripLabel,
    } = this.state;
    const { tripData, vehicleData } = this.props;
    const {
      pickup,
      dropoff,
      trip_id,
      mobility_aids,
      trip_status,
      is_imminent,
    } = tripData;

    return (
      <section className="flex flex-col flex-grow relative">
        <div className="bg-white maps-info px-3 py-2 justify-between shadow z-20 flex">
          <div className="text-left">
            <div>{formattedDate}</div>
            <div>{tripData.pickup.window_display}</div>
          </div>
          <div className="text-right">
            <div className="text-blue font-bold">
              <Text text={tripLabel} />
            </div>
            {tripLabel !== 'IN_TRANSIT' && vehicleData && vehicleData.vehicle && vehicleData.vehicle.name && (
              <div>
                <i className="icon-vehicle-pin mx-2" />
                <span>{vehicleData.vehicle.name}</span>
              </div>
            )
            }
          </div>
        </div>
        <div style={{ height: `${mapHeight}px` }}>
          { pickupCoordinates && dropOffCoordinates
            && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
              defaultCenter={defaultCenter}
              center={center}
              options={{ gestureHandling: 'greedy' }}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={
                ({ map, maps }) => this.laodMapInfo(
                  map,
                  maps,
                  pickupCoordinates,
                  circleRadius,
                  showRadius,
                )
              }
              defaultZoom={zoom}
            >

              {(
                dropOffCoordinates
                && (
                  <MapPin
                    type="dropoff"
                    lat={dropOffCoordinates.lat}
                    lng={dropOffCoordinates.lng}
                    label={tripData.dropoff.name.trim() !== '' ? tripData.dropoff.name.toLowerCase() : tripData.dropoff.street.toLowerCase()}
                  />
                )
              )}
              {(
                pickupCoordinates
                && (
                  <MapPin
                    type="pickup"
                    lat={pickupCoordinates.lat}
                    lng={pickupCoordinates.lng}
                    label={tripData.pickup.name.trim() !== '' ? tripData.pickup.name.toLowerCase() : tripData.pickup.street.toLowerCase()}
                  />
                )
              )}
              {(
                vehicleCoordinates && vehicleData
                && (
                  <MapPin
                    type="vehicle"
                    lat={vehicleCoordinates.lat}
                    lng={vehicleCoordinates.lng}
                    label={vehicleData.vehicle.name}
                  />
                )
              )}
            </GoogleMapReact>
            )
          }
        </div>
        <div className="absolute w-full z-20 p-3 bottom-0">
          <Card className="map-card overflow-hidden">
            <div className="text-blue px-3 pt-3">
              <p className="text-lg font-bold">
                {(is_imminent && trip_status === 'Scheduled') ? `${tripData.dropoff.estimatedArrivalTimeDisplay} ETA` : tripData.pickup.window_display }
              </p>
            </div>
            <div className="endpoints p-3">
              <ul className="flex mb-0">
                <li className="flex-shrink overflow-hidden leading-none">
                  <div className="circle mr-2 text-center" />
                  <div className="dot ml-1">: : : : : : : : : : : :</div>
                </li>
                <li className="flex-1">
                  <div className="pickupContainer pb-2">
                    <div className="capitalize">{pickup.name.trim() !== '' ? pickup.name.toLowerCase() : pickup.street.toLowerCase()}</div>
                  </div>
                </li>
              </ul>
              <ul className="flex">
                <li className="flex-shrink overflow-hidden leading-none">
                  <i className="icon-location-pin text-xl mr-2 drop" />
                </li>
                <li className="flex-1">
                  <div className="pickupContainer">
                    <div className="capitalize">{dropoff.name.trim() !== '' ? dropoff.name.toLowerCase() : dropoff.street.toLowerCase()}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="passenger-info justify-between flex p-3 bg-gray-100">
              <div className="flex flex-grow-1">
                <div className="mr-3">
                  <i className="icon-passenger opacity-50 mr-1" />
                  1
                </div>
                {(
                  mobility_aids.trim() !== ''
                  && (
                  <div className="mr-3">
                    <i className="icon-mobility-aid opacity-50 mr-1" />
                    {
                      mobility_aids.split(',').length
                    }
                  </div>
                  )
                )}
              </div>
              <div>
                <i className="icon-confirmation-number opacity-50 mr-1" />
                {trip_id}
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }
}

export default withRouter(MapViewContainer);
