import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'fancy-notifications';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Push } from '@ionic-native/push';
import { Provider } from 'mobx-react';
import AppContainer from './AppContainer';
import { MVStore } from './data';
import { Plugins } from './capacitor';


import './assets/fonts/mv-icons/mv-icons.min.css';
import './assets/fonts/dmsans/dmsans.css';
import './styles/styles.scss';


const renderApp = () => {
  ReactDOM.render((
    <Provider MVStore={new MVStore()}>
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </Provider>
  ), document.getElementById('root'));
};

let notifications = [];
const { FancyNotifications } = Plugins;

const updateBadgeCount = async (badgeCount) => {
  const check = await FancyNotifications.hasPermission();
  if (check.value) {
    FancyNotifications.setBadgeCount({ count: badgeCount });
  } else {
    const request = await FancyNotifications.requestPermission();
    if (request.value) {
      FancyNotifications.setBadgeCount({ count: badgeCount });
    }
  }
};

const initPushNotifications = async () => {
  const { PushNotifications, LocalNotifications } = Plugins;
  PushNotifications.register();

  PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    const notificationItem = {
      title: 'Trips notification',
      body: notification.data.default,
      smallIcon: 'ic_notification',
      id: notifications.length + 1,
      sound: null,
      attachments: null,
      actionTypeId: '',
      extra: null,
    };
    notifications.push(notificationItem);
    await updateBadgeCount(notifications.length);
    LocalNotifications.schedule({ notifications });
  });

  PushNotifications.addListener('registration', (token) => {
    localStorage.setItem('device-token', token.value);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', async () => {
    await updateBadgeCount(0);
    notifications = [];
  });

  LocalNotifications.addListener('localNotificationActionPerformed',
    async () => {
      notifications = [];
      await updateBadgeCount(0);
    });
};

const initApp = async () => {
  const { Keyboard, SplashScreen, Device } = Plugins;
  SplashScreen.hide();
  const deviceInfo = await Device.getInfo();
  localStorage.setItem('x-device-platform', deviceInfo.platform);
  if (deviceInfo.platform === 'android') {
    Push.hasPermission()
      .then((res) => {
        if (res.isEnabled) {
          initPushNotifications();
        }
      })
      .catch(error => console.log('Push Error', error));
  } else if (deviceInfo.platform === 'ios') {
    initPushNotifications();
  }
  Keyboard.setAccessoryBarVisible({ isVisible: true });
  renderApp();
};

if (window.cordova) {
  document.addEventListener('deviceready', initApp, false);
} else {
  renderApp();
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
