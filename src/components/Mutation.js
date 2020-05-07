import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  buildRequestHeaders,
  passengersApiBaseUrl,
  divisionsApiBaseUrl,
} from '../utils';

class MutationComponent extends Component {
  state = {
    loading: false,
    data: null,
    error: null,
  }


  mutation = async (input = null) => {
    const { url, method, endpoint } = this.props;
    const baseUrl = endpoint === 'passenger' ? passengersApiBaseUrl : divisionsApiBaseUrl;

    const result = await new Promise((resolve, reject) => {
      this.setState({ loading: true, error: null }, () => {
        fetch(baseUrl + url, {
          method,
          ...(input ? { body: JSON.stringify(input) } : {}),
          mode: 'cors',
          headers: buildRequestHeaders(),
        }).then(res => res.json()).then((data) => {
          if (data.success === true) {
            this.setState({
              loading: false,
              data,
            });
            resolve(data);
          } else {
            this.setState({
              loading: false,
              error: data.message,
            });
            reject(data.message);
          }
        }).catch((error) => {
          this.setState({
            loading: false,
            error,
          });
          reject(error);
        });
      });
    });

    return result;
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { loading, data, error } = this.state;

    return (
      <>
        {children(this.mutation, { loading, data, error })}
      </>
    );
  }
}
MutationComponent.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  endpoint: PropTypes.string,
};

MutationComponent.defaultProps = {
  method: 'POST',
  endpoint: 'passenger',
};

export default MutationComponent;
