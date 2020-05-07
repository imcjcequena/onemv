import React, { Component } from 'react';
import Query from './Query';
import Text from './Text';
import Spinner from './Spinner';
import { query } from '../utils';


export default class GoogleSignIn extends Component {
  signIn = (url) => {
    window.location = url;
  }

  webLogin = () => (
    <Query url={query.googleAuthUrl}>
      {
        ({ loading, error, data }) => {
          if (error) {
            return <div>error</div>;
          }
          if (loading) {
            return <Spinner />;
          }
          return <button className="rounded-full w-full bg-google border-2 border-solid border-white text-white py-3 px-4 my-2 rounded" type="button" onClick={() => this.signIn(data.data)}><Text text="LOGIN_WITH_GOOGLE" /></button>;
        }
      }
    </Query>
  )


  render = () => {
    const { cordovaLogin, onClick } = this.props;
    return (
      <>
        {
          cordovaLogin
          && (
            <div>
              <button className="rounded-full w-full bg-google border-2 border-solid border-white text-white py-3 px-4 my-2 rounded" type="button" onClick={onClick}>Google Sign In</button>
            </div>
          )
        }
        {
          !cordovaLogin && this.webLogin()
        }
      </>
    );
  }
}
