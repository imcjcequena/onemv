/* eslint-disable brace-style */
/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export, import/no-named-default */
import {
  passengersApiBaseUrl,
  divisionsApiBaseUrl,
  query,
  mutation,
} from './Endpoints';
import i18n from './i18n';

export const queryParamsToObject = (url) => {
  // eslint-disable-next-line prefer-const
  let result = {};
  const searchIndex = url.indexOf('?');

  if (searchIndex === -1) return result;
  const sPageURL = url.substring(searchIndex + 1);
  const sURLVariables = sPageURL.split('&');
  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split('=');
    // eslint-disable-next-line prefer-destructuring
    result[sParameterName[0]] = sParameterName[1];
  }
  return result;
};

export const buildRequestHeaders = (endpoint) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-division-id': localStorage.getItem('x-division-id'),
    Authorization: `Bearer ${localStorage.getItem('userToken') || ''}`,
  };

  if (window.cordova) {
    headers.isMobile = true;
    headers['x-device-platform'] = localStorage.getItem('x-device-platform');
  }
  switch (endpoint) {
    case 'division': {
      headers.key = process.env.REACT_APP_DIVISION_API_KEY;
      headers.secret = process.env.REACT_APP_DIVISION_API_SECRET;
      break;
    }
    default:
  }
  return headers;
};

// eslint-disable-next-line max-len
export const isObjectEmpty = (obj = {}) => Object.keys(obj).length === 0 && obj.constructor === Object;

export const formatTime = (date) => {
  let hours = date.getUTCHours() - 6;
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = (hours % 12) ? hours % 12 : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

const getMonthName = (index) => {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEPT',
    'OCT',
    'NOV',
    'DEC',
  ];
  return i18n(months[index]);
};

const getDayName = (index) => {
  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  return i18n(days[index]);
};

export const getTodayFromDivision = (divisionId, format = null) => {
  const url = `${divisionsApiBaseUrl}/divisions/${divisionId}/now${format === null ? '' : `?format=${format}`}`;
  // eslint-disable-next-line arrow-body-style
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    return fetch(url, {
      headers: {
        key: process.env.REACT_APP_DIVISION_API_KEY,
        secret: process.env.REACT_APP_DIVISION_API_SECRET,
      },
    })
      .then(res => res.json())
      .then((data) => {
        if (!data.success) {
          return reject(data.message);
        }
        return resolve(data.data);
      })
      .catch(error => reject(new Error(error.code)));
  });
};

export const getFormattedDate = async (date, refDate = null) => {
  const dateObj = new Date(date);
  const month = getMonthName(dateObj.getMonth());
  const year = dateObj.getFullYear();
  const day = dateObj.getDate();
  const dayName = getDayName(dateObj.getDay());
  const divisionId = localStorage.getItem('x-division-id');
  const today = refDate || await getTodayFromDivision(divisionId, 'MM/DD/YYYY');
  return `${month} ${day}, ${year} - ${today === date ? i18n('TODAY') : dayName}`;
};

export const formatDateFromNumber = (numDate) => {
  const strDate = numDate.toString();
  const year = strDate.substring(0, 4);
  const monthNum = parseInt(strDate.substring(4, 6), 10) - 1;
  const day = strDate.substring(6, 8);

  return `${getMonthName(monthNum)} ${day}, ${year}`;
};

const deg2rad = deg => deg * Math.PI / 180;

// Basic Distance formula
export const getDistanceInKM = (locA, locB) => {
  const R = deg2rad(6371);
  const a = parseFloat(locA.lat - locB.lat);
  const b = parseFloat(locA.lng - locB.lng);
  return Math.sqrt(a * a + b * b) * R;
};

const calcTime = (distance, rate = 40) => distance / rate;

export const getTimeStr = (distance, rate = 40) => {
  const time = calcTime(distance, rate);
  const mins = Math.ceil(time * 60);

  return mins > 1 ? `${mins} mins away` : 'Your trip has arrived';
};

export const isLoggedIn = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userToken = localStorage.getItem('userToken');
  return !accessToken || !refreshToken || !userToken;
};

export const cachedDivision = () => {
  const divisionId = localStorage.getItem('x-division-id');
  const userLoggedIn = localStorage.getItem('userHasLoggedIn');
  return (divisionId && userLoggedIn);
};

export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (!(password.length >= 8)) return 'password.length';
  return null;
};

export const fetchQuery = (args) => {
  const {
    url,
    input,
    method,
    endpoint,
  } = args;
  const baseUrl = endpoint === 'division' ? divisionsApiBaseUrl : passengersApiBaseUrl;
  return new Promise((resolve, reject) => {
    fetch(baseUrl + url, {
      method,
      ...(input ? { body: JSON.stringify(input) } : {}),
      mode: 'cors',
      headers: buildRequestHeaders(),
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

export const getTripLabel = (tripData) => {
  const {
    pickup,
    dropoff,
    is_imminent,
    trip_status,
  } = tripData;
  let tripLabel = '';

  if (is_imminent && trip_status === 'Scheduled') {
    if (!pickup.actual_arrival_time) {
      const eta = pickup.etaStr < 0 ? Math.ceil((pickup.etaStr * -1)) : Math.ceil(pickup.etaStr);
      const etaStr = eta <= 1 ? 'min' : 'mins';
      tripLabel = `${eta} ${etaStr} away`;
    } else if (pickup.actual_arrival_time
      && !pickup.actual_departure_time
    ) {
      tripLabel = 'YOUR_TRIP_HAS_ARRIVED';
    } else if (pickup.actual_arrival_time
      && pickup.actual_departure_time
      && !dropoff.actual_arrival_time
    ) {
      tripLabel = 'IN_TRANSIT';
    }
  } else if (trip_status === 'Completed') {
    tripLabel = 'COMPLETED';
  } else if (trip_status === 'Canceled') {
    tripLabel = 'CANCELED';
  } else if (trip_status.toLowerCase() === 'no show') {
    tripLabel = 'NO_SHOW';
  } else {
    tripLabel = trip_status.toUpperCase();
  }
  return tripLabel;
};

export const maskedEmail = (email) => {
  let maskid = '';
  const prefix = email.substring(0, email.lastIndexOf('@'));
  const postfix = email.substring(email.lastIndexOf('@'));

  for (let i = 0; i < prefix.length; i += 1) {
    if (i > prefix.length - 4) {
      maskid += prefix[i].toString();
    }
    else {
      maskid += '*';
    }
  }
  maskid += postfix;
  return maskid;
};

export const temporaryClearCache = (history, MVStore) => {
  const hasClearedCache = localStorage.getItem('hasClearedCache');
  if (!hasClearedCache) {
    localStorage.setItem('hasClearedCache', true);
    localStorage.removeItem('idToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('x-division-code');
    localStorage.removeItem('x-division-id');
    MVStore.clear();
    history.replace('/');
  }
};

export const checkPasswordStrength = (password) => {
  const regexLowerCase = /[a-z]/;
  const regexUpperCase = /[A-Z]/;
  const regexNumber = /[0-9]/;
  const regGexGreaterEight = /^.{8,}$/;
  if (regGexGreaterEight.test(password) && regexLowerCase.test(password) && regexUpperCase.test(password) && regexNumber.test(password)) {
    return 'Strong';
  } if ((regexLowerCase.test(password) && regexUpperCase.test(password) && regGexGreaterEight.test(password)) || (regexLowerCase.test(password) && regexNumber.test(password) && regGexGreaterEight.test(password))) {
    return 'Good';
  } return 'Weak';
};

export { default as i18n } from './i18n';
export {
  passengersApiBaseUrl,
  divisionsApiBaseUrl,
  query,
  mutation,
};
export { default as goBack } from './History';
