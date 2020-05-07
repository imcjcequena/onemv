import React, { Component } from 'react';

class MapPin extends Component {
  state = {
    pinHeight: 0,
  };

  componentDidMount = () => this.setState({ pinHeight: this.pinElement.clientHeight });


  setRef = (element) => {
    this.pinElement = element;
  }

  render = () => {
    const { label, type } = this.props;
    const { pinHeight } = this.state;
    const style = {
      transform: `translateY(${15 - pinHeight}px)`,
    };
    return (
      <>
        {
          (type === 'pickup')
          && (
            <div
              className="text-3xl flex flex-col items-center pin"
              ref={element => this.setRef(element)}
              style={style}
            >
              <div className="pinAddr p-1 rounded-sm capitalize text-md text-gray-900 relative">{label}</div>
              <i className="pickup-pin" />
            </div>
          )
        }
        {
          (type === 'dropoff')
          && (
            <div
              className="text-3xl flex flex-col items-center pin"
              ref={element => this.setRef(element)}
              style={style}
            >
              <div className="pinAddr p-1 rounded-sm capitalize text-md text-gray-900 relative">{label}</div>
              <i className="icon-location-pin text-red" />
            </div>
          )
        }
        {
          (type === 'vehicle')
          && (
            <div
              className="text-3xl flex flex-col items-center pin"
              ref={element => this.setRef(element)}
              style={style}
            >
              <div className="pinAddr vehicle p-1 rounded-sm capitalize text-md text-gray-900 relative">{label}</div>
              <i className="icon-vehicle-pin text-primary" />
            </div>
          )
        }
      </>
    );
  }
}

export default MapPin;
