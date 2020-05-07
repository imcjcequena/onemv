import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Text from '../Text';
import {
  ErrorMessage,
} from '../index';
import {
  passengersApiBaseUrl,
  query,
  buildRequestHeaders,
} from '../../utils';
import './Footer.scss';


// const Footer = ({ className, withLink }) => (
class Footer extends Component {
  state = {
    version: localStorage.getItem('appVersion') ? localStorage.getItem('appVersion') : '0.0.0',
  }

  componentDidMount = () => {
    fetch(`${passengersApiBaseUrl}${query.getVersion}`, {
      headers: buildRequestHeaders('passenger'),
    })
      .then(res => res.json())
      .then((data) => {
        localStorage.setItem('appVersion', data.data[0].version);
        this.setState({ version: data.data[0].version });
      })
      .catch(error => (
        <ErrorMessage
          message={error}
        />
      ));
  }

  render = () => {
    const { className, withLink } = this.props;
    const { version } = this.state;
    return (
      <footer role="group" className={`w-full py-3 bottom-0 ${className}`}>
        {withLink
        && ((
          <div className="w-full text-white underline pb-2">
            <Link className="px-8" to="/whatsNew">News</Link>
            <Link className="px-8" to="/policy">Policy</Link>
            <Link className="px-8" to="/support">Support</Link>
          </div>
        ))}
        <div className="text-center mx-auto text-white">
          <div className="text-xs">
            <p className="mb-1"><Text text="POWERED_BY" /></p>
            <i className="icon-mv-logo text-2xl" />
            <p><Text text="COPYRIGHT" /></p>
            <p>
              <Text text="APP_VERSION" />
              &nbsp;
              {version}
            </p>
            <p>
              <Text text="MV_COMPANY_NAME" />
              <a
                className="underline"
                href="https://mvtransit.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text text="MV_COMPANY_LINK" />
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
