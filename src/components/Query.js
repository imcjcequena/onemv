import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  buildRequestHeaders,
  passengersApiBaseUrl,
  divisionsApiBaseUrl,
} from '../utils';

class QueryComponent extends Component {
  state = {
    loading: true,
    data: null,
    error: null,
  }

  fetchData = () => {
    const {
      url,
      input,
      method,
      endpoint,
      isPolling,
    } = this.props;
    const baseUrl = endpoint === 'passenger' ? passengersApiBaseUrl : divisionsApiBaseUrl;
    this.setState({ error: null });
    fetch(baseUrl + url, {
      method,
      ...(input ? { body: JSON.stringify(input) } : {}),
      mode: 'cors',
      headers: buildRequestHeaders(endpoint),
    }).then(res => res.json()).then((data) => {
      if (data.success === true) {
        this.setState({
          loading: false,
          data,
        }, () => {
          if (isPolling) this.longPolling();
        });
      } else {
        this.setState({
          loading: false,
          error: data.message,
        });
      }
    }).catch((error) => {
      this.setState({
        loading: false,
        error,
      });
    });
  }

  refetch = () => {
    const { fetchData } = this;
    this.setState({ loading: true, error: null, data: null });
    fetchData();
  }

  componentDidMount = () => {
    const { fetchData } = this;
    fetchData();
  }

  componentWillUnmount = () => {
    if (this.timeout) clearTimeout(this.timeout);
  }

  buildRequestOptions = () => {
    const { method, input, endpoint } = this.props;
    const options = {
      method,
      ...(input ? { body: JSON.stringify(input) } : {}),
      mode: 'cors',
      headers: buildRequestHeaders(),
    };

    switch (endpoint) {
      case 'division': {
        if (input) {
          input.key = process.env.REACT_APP_DIVISION_API_KEY;
          input.secret = process.env.REACT_APP_DIVISION_API_SECRET;
          options.body = JSON.stringify(input);
        } else {
          options.body = JSON.stringify({
            key: process.env.REACT_APP_DIVISION_API_KEY,
            secret: process.env.REACT_APP_DIVISION_API_SECRET,
          });
        }
        break;
      }
      default:
        // passenger api auth keys
    }

    return options;
  };

  // does not trigger loading, so new data should be injected to the child
  longPolling = () => {
    const {
      url,
      endpoint,
      isPolling,
      pollingInterval,
    } = this.props;
    const baseUrl = endpoint === 'passenger' ? passengersApiBaseUrl : divisionsApiBaseUrl;
    if (isPolling) {
      this.timeout = setTimeout(() => {
        fetch(baseUrl + url, this.buildRequestOptions()).then(res => res.json()).then((data) => {
          this.setState({
            loading: false,
            data,
          }, () => this.longPolling());
        }).catch((error) => {
          this.setState({
            loading: false,
            error,
          }, () => this.longPolling());
        });
      }, pollingInterval);
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { loading, data, error } = this.state;
    const { refetch } = this;

    return (
      <>
        {children({
          loading,
          data,
          error,
          refetch,
        })}
      </>
    );
  }
}
QueryComponent.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  endpoint: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object,
  isPolling: PropTypes.bool,
  pollingInterval: PropTypes.number,
};

QueryComponent.defaultProps = {
  method: 'GET',
  input: null,
  isPolling: false,
  endpoint: 'passenger',
  pollingInterval: 3000, // (3 Seconds) for sample purposes only
};

export default QueryComponent;
