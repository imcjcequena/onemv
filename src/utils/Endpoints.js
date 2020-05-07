export const passengersApiBaseUrl = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_ENDPOINT}`;
export const divisionsApiBaseUrl = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_DIVISION_API_ENDPOINT}`;

export const query = {
  getStates: '/states',
  googleAuthUrl: '/auth/google/authUrl',
  googleAuthToken: '/auth/google/register',
  googleAuthSignIn: '/auth/google/signIn',
  getVersion: '/versions/latest',
};

export const mutation = {
  verifyClient: '/passengers/verify',
  onemvLink: '/auth/onemv/link',
  onemvSignIn: '/auth/onemv/signIn',
  onemvRegister: '/auth/onemv/register',
  onemvForgotPassword: '/auth/onemv/forgotPassword',
  onemvPasswordReset: '/auth/onemv/passwordReset',
  googleAuthToken: '/auth/google/register',
  googleAuthLink: '/auth/google/link',
  onemvChangePassword: '/auth/onemv/changePassword',
};

export default {
  divisionsApiBaseUrl,
  passengersApiBaseUrl,
  query,
  mutation,
};
