/* eslint-disable camelcase */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import {
  ScreenContainer,
  StarRatings,
  Mutation,
  Header,
  Card,
  Input,
  Text,
  Spinner,
} from '../../components';
import { i18n } from '../../utils';
import './TripRatingsScreen.scss';
import onemvLogo from '../../assets/images/ic-onemv-logo.svg';

class TripRatingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.location.state ? props.location.state.trip_id : null,
      rating: props.location.state ? props.location.state.rating : null,
      comments: '',
    };
  }

  setRating = value => this.setState({ rating: value });

  textAreaAdjust = (e) => {
    // TODO: Do not directly manipulate the DOM
    // Handle style changes via state
    const theElement = e.target;
    theElement.style.height = '1px';
    theElement.style.height = `${theElement.scrollHeight}px`;
  }

  handleChange = (key, event) => {
    switch (key) {
      case 'comments': {
        this.textAreaAdjust(event);
        break;
      }
      default: {
        break;
      }
    }
    if (event.target.value.length <= 160) {
      this.setState({ [key]: event.target.value });
    }
  }

  submit = async (sendRating) => {
    const { history, MVStore } = this.props;
    const { passengerId } = MVStore.profile;
    const { rating, comments } = this.state;
    const data = {
      passengerId,
      rating,
      comments,
    };
    const result = await sendRating(data);
    if (result && result.success) {
      history.push('/trips/recent');
    }
  }

  render = () => {
    const {
      rating,
      comments,
      id,
    } = this.state;
    const { history, onBoarding } = this.props;
    return (
      <ScreenContainer className={onBoarding ? 'trip-ratings h-full' : 'trip-ratings'}>
        <Header className="justify-between" showBackNavigation={false} showClose>
          {/* added w-10 h-6 for IE fix for img-stretch */}
          <img src={onemvLogo} alt="onemv-logo" className="w-10 h-6 text-center flex-grow" />
        </Header>
        {
          onBoarding
          && ((
            <section className="px-5 flex-col w-full flex items-center flex-1 justify-center">
              <div className="pt-48 px-5 w-full">
                <button
                  className="rounded-full max-screen w-full bg-blue-100 hover:bg-blue-700 focus:outline-none text-white py-3 px-4 rounded"
                  type="submit"
                >
                  <Text text="SUBMIT_RATING" />
                </button>
              </div>
            </section>
          ))
        }
        {
          !onBoarding
          && ((
            <Mutation
              url={`/trips/${id}/ratings`}
              method="PUT"
              className="w-100 p-3"
            >
              {
                ((sendRating, { error, loading }) => (
                  <>
                    <Card>
                      <StarRatings onClick={this.setRating} className="mx-auto w-3/4 text-4xl p-3 px-5" ratings={rating} />
                      <div className="w-100 text-center pb-3">
                        {rating > 3 ? i18n('SHARE_YOUR_EXPERIENCE') : i18n('HELP_US_IMPROVE_EXPERIENCE')}
                      </div>
                      <div className="comments w-100 border-bottom font-italic text-left p-1 outline-none">
                        <Input
                          placeholder={i18n('COMMENTS')}
                          value={comments}
                          rows="1"
                          onChange={e => this.handleChange('comments', e)}
                          className="w-full mt-5"
                          type="textarea"
                          maxLength="160"
                        />
                      </div>
                      <div className="text-right text-gray-400">{`${comments.length}/160`}</div>
                    </Card>
                    {
                      (loading) ? <Spinner /> : (
                        <button
                          type="button"
                          onClick={() => this.submit(sendRating)}
                          className="text-white p-3 bg-primary rounded-full w-full"
                        >
                          <Text text="SUBMIT_RATING" />
                        </button>
                      )
                    }
                    {(
                      (error)
                        && (
                          <div id="myModal" className="modal">
                            <div className="w-11/12 mx-auto mt-40">
                              <Card className="p-8">
                                <div>
                                  <i className="text-success icon-sad-face self-center text-6xl" />
                                  <div className="text-lg font-bold my-5">
                                    <Text text="OOPS_WE_ARE_UNABLE_TO_SUBMIT_YOUR_RATING" />
                                  </div>
                                  <div className="flex p-3">
                                    <button
                                      type="button"
                                      onClick={() => this.submit(sendRating)}
                                      className="mr-1 flex-1 text-white p-3 bg-primary rounded-full w-full"
                                    >
                                      <Text text="RETRY" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { history.push('/home'); }}
                                      className="ml-1 flex-1 text-white p-3 bg-primary rounded-full w-full"
                                    >
                                      <Text text="SUBMIT_LATER" />
                                    </button>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        )
                    )}
                  </>
                ))
              }
            </Mutation>
          ))
        }
      </ScreenContainer>
    );
  }
}

export default compose(inject('MVStore'), observer)(withRouter(TripRatingsScreen));
