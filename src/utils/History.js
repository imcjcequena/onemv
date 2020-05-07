const mapHistory = {
  '/clientVerification': '/',
  '/loginSelection': '/clientVerification',
  '/home': '/home', // currently being redirected google sign in with error
};

// eslint-disable-next-line import/prefer-default-export
const goBack = (history, currentUrl) => {
  const toNav = mapHistory[currentUrl];
  console.log(currentUrl, toNav);
  if (toNav) history.push(toNav);
};

export default goBack;
