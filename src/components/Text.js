import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../utils';

const Text = ({ text, translate }) => (
  <>
    { translate && i18n(text) }
    { !translate && text }
  </>
);

Text.propTypes = {
  text: PropTypes.string,
  translate: PropTypes.bool,
};

Text.defaultProps = {
  text: null,
  translate: true,
};

export default Text;
