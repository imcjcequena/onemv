/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-mutable-exports */
let Capacitor = null;
let Plugins = null;

try {
  if (window.Proxy) {
    // eslint-disable-next-line global-require
    const capacitor = require('@capacitor/core');
    Capacitor = capacitor.Capacitor;
    Plugins = capacitor.Plugins;
  } else {
    Capacitor = null;
    Plugins = null;
  }
} catch (e) {
  console.log(e);
}

export {
  Capacitor,
  Plugins,
};
