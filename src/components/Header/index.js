import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { i18n } from '../../utils';
import './Header.scss';

class Header extends Component {
  componentDidMount = () => {};

  onBackButtonClick = () => {
    const { history, path } = this.props;
    if (path) {
      history.replace(path);
      return;
    }
    history.goBack();
  }

  render = () => {
    const {
      title,
      showBackNavigation,
      showClose,
      children,
    } = this.props;
    return (
      <header className="w-full flex p-3">
        {(title && <h1 className="title capitalize order-2 text-center flex-grow font-bold">{title}</h1>)}
        {(showBackNavigation
        && (
          <button type="button" aria-label={i18n('BACK_BUTTON')} className="items-center" onClick={this.onBackButtonClick}>
            <i className="icon-chevron-left text-2xl" />
          </button>
        ))}
        {(showClose
        && (
          <button type="button" className="absolute" onClick={this.onBackButtonClick}>
            <i className="icon-close text-2xl" />
          </button>
        ))}
        {children}
      </header>
    );
  }
}

export default withRouter(Header);

Header.propTypes = {
  title: PropTypes.string,
  showBackNavigation: PropTypes.bool,
  showClose: PropTypes.bool,
};
Header.defaultProps = {
  title: null,
  showBackNavigation: true,
  showClose: false,
};
