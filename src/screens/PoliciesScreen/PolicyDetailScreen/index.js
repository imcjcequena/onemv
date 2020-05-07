/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import { isObjectEmpty } from '../../../utils';
import {
  Header,
  ScreenContainer,
  Query,
  Card,
  ErrorMessage,
  Text,
  Spinner,
} from '../../../components';

class PolicyDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Policy',
      id: props.match.params.id,
    };
  }

  componentDidMount = () => {
  }

  render = () => {
    const { MVStore, history } = this.props;
    const { id, name } = this.state;
    return (
      <ScreenContainer className="menuScreen">
        <Header title={name} />
        <section className="flex flex-col p-3 flex-grow listContainer">
          <Query endpoint="division" url={`/policy/${id}`}>
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
                      store={MVStore}
                      history={history}
                      className="h-full text-lg font-bold flex items-center justify-center text-center"
                      onClick={() => refetch()}
                    />
                  );
                }
                const policy = data.data;
                if (isObjectEmpty(policy)) {
                  return (
                    <Card>
                      <strong>
                        <Text text="NO_POLICIES" />
                      </strong>
                    </Card>
                  );
                }
                return (
                  <div dangerouslySetInnerHTML={{ __html: policy.policy_html }} />
                );
              }
            }
          </Query>
        </section>
      </ScreenContainer>
    );
  };
}

export default compose(inject('MVStore'), observer)(withRouter(PolicyDetailScreen));
