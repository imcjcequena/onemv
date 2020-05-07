/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import { isObjectEmpty } from '../../utils';
import {
  Header,
  ScreenContainer,
  Query,
  Card,
  ErrorMessage,
  Text,
  Spinner,
} from '../../components';

class PoliciesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Policies',
      divisionId: localStorage.getItem('x-division-id'),
    };
  }

  componentDidMount = () => {}

  render = () => {
    const { MVStore, history } = this.props;
    const { name, divisionId } = this.state;
    return (
      <>
        <ScreenContainer className="menuScreen">
          <Header title={name} />
          <section className="p-3">
            <div className="w-full">
              <Query endpoint="division" url={`/policy/division/${divisionId}/list`}>
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
                    const policiesList = data.data;
                    if (isObjectEmpty(policiesList) || policiesList.length === 0) {
                      return (
                        <Card>
                          <strong>
                            <Text text="NO_POLICIES" />
                          </strong>
                        </Card>
                      );
                    }
                    return policiesList.map(policy => (
                      <Link key={policy._id} to={`/policyDetails/${policy._id}`}>
                        <button
                          className="w-full font-bold p-3 shadow-xl bg-white rounded-lg mt-4"
                          type="button"
                        >
                          {policy.name}
                        </button>
                      </Link>
                    ));
                  }
                }
              </Query>
            </div>
          </section>
        </ScreenContainer>
      </>
    );
  };
}

export default compose(inject('MVStore'), observer)(withRouter(PoliciesScreen));
