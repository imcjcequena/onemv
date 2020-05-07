/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import { isObjectEmpty, i18n } from '../../utils';
import {
  Header,
  ScreenContainer,
  HTMLCard,
  Query,
  Spinner,
  ErrorMessage,
  Text,
  Card,
} from '../../components';

class WhatsNewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      divisionId: localStorage.getItem('x-division-id'),
    };
  }

  componentDidMount = () => {}

  render = () => {
    const { history, MVStore } = this.props;
    const { divisionId } = this.state;
    return (
      <>
        <Header title={i18n('WHATS_NEW')} />
        <ScreenContainer className="whatsNewScreen">
          <section className="flex flex-col p-3 flex-grow listContainer">
            <Query endpoint="division" url={`/whats-new/division/${divisionId}`}>
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
                        <strong><Text text="NO_WHATS_NEW" /></strong>
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
          </section>
        </ScreenContainer>
      </>
    );
  };
}

export default compose(inject('MVStore'), observer)(withRouter(WhatsNewScreen));
