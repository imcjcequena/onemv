/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isObjectEmpty, i18n } from '../../utils';
import OnBoarding from '../OnBoarding'
import {
  Header,
  ScreenContainer,
  ErrorMessage,
  HTMLCard,
  Text,
  Query,
  Card,
  Spinner,
} from '../../components';

class SupportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      divisionId: localStorage.getItem('x-division-id'),
      onBoarding: false,
    };
  }

  componentDidMount = () => {
    const { divisionId } = this.state;
    const { history } = this.props;
    if (!divisionId) return history.push('/');
  }

  clickOnBoarding = () => {
    this.setState({ onBoarding: true });
  }

  goBackSupport = () => {
    this.setState({ onBoarding: false });
  }

  render = () => {
    const { divisionId, onBoarding } = this.state;
    const { history, MVStore } = this.props;
    return (
      <>
        {
          onBoarding
            ? <OnBoarding goBackSupport={this.goBackSupport} />
            : (
              <ScreenContainer className="supportScreen">
                <Header title={i18n('SUPPORT_PAGE_TITLE')} />
                <main className="flex flex-col p-3 flex-grow listContainer">
                  <Query endpoint="division" url={`/support/division/${divisionId}`}>
                    {
                      ({
                        loading,
                        error,
                        data,
                        refetch,
                      }) => {
                        if (loading) {
                          return <Spinner />;
                        }
                        if (error) {
                          return (
                            <ErrorMessage
                              message={error}
                              history={history}
                              store={MVStore}
                              className="h-full text-lg font-bold flex items-center justify-center text-center"
                              onClick={() => refetch()}
                            />
                          );
                        }
                        const whatsNews = data.data;
                        if (isObjectEmpty(whatsNews) || whatsNews.length === 0) {
                          return (
                            <Card>
                              <strong>
                                <Text text="SUPPORT_PAGE_NO_DATA" />
                              </strong>
                            </Card>
                          );
                        }
                        return whatsNews.map(item => (
                          <HTMLCard
                            key={item._id}
                            data={item.display_html}
                          />
                        ));
                      }
                    }
                  </Query>
                  <button
                    onClick={() => { this.clickOnBoarding(); }}
                    className="rounded-full w-full bg-blue-100 text-white py-3 px-4 rounded"
                    type="button"
                  >
                    <Text text="VIEW_THE_TUTORIAL" />
                  </button>
                </main>
              </ScreenContainer>
            )
        }
      </>
    );
  };
}

export default withRouter(SupportScreen);
