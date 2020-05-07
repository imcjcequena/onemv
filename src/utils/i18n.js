/* eslint-disable import/prefer-default-export */
import EN from './languages/en.json';
import ES from './languages/es.json';

const i18n = (str) => {
  let text = str;
  switch (navigator.language) {
    case 'es': {
      if (ES[str]) {
        text = ES[str];
      } else if (EN[str]) {
        text = EN[str];
      } else {
        text = str;
      }
      break;
    }
    default: {
      text = EN[str] ? EN[str] : str;
    }
  }
  return text;
};

export default i18n;
