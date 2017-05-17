import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  getDiscussions,
  getPinnedDiscussions,
  updateSortingMethod,
} from './actions';

import Button from 'Components/Button';
import FeedBox from 'Components/FeedBox';
import SideBar from 'Components/SideBar';

import appLayout from 'SharedStyles/appLayout.css';
import styles from './styles.css';

class ForumFeed extends Component {
  componentDidMount() {
    const {
      currentForum,
      getDiscussions,
      getPinnedDiscussions,
    } = this.props;

    getDiscussions(currentForum);
    getPinnedDiscussions(currentForum);
  }

  componentDidUpdate(prevProps) {
    const {
      currentForum,
      getDiscussions,
      getPinnedDiscussions,
    } = this.props;

    if (prevProps.currentForum !== currentForum) {
      const feedChanged = true;
      getDiscussions(currentForum, feedChanged);
      getPinnedDiscussions(currentForum, feedChanged);
    }
  }

  handleSortingChange(newSortingMethod) {
    const {
      currentForum,
      getDiscussions,
      updateSortingMethod,
      sortingMethod,
    } = this.props;

    if (sortingMethod !== newSortingMethod) {
      updateSortingMethod(newSortingMethod);
      getDiscussions(currentForum, false, true);
    }
  }

  renderNewDiscussionButtion() {
    const { currentForum } = this.props;

    return (
      <div className={classnames(appLayout.showOnMediumBP, styles.newDiscussionBtn)}>
        <Link to={`/${currentForum}/new_discussion`}>
          <Button type='outline' fullWidth noUppercase>
            New Discussion
          </Button>
        </Link>
      </div>
    );
  }

  render() {
    const {
      currentForum,
      discussions,
      fetchingDiscussions,
      pinnedDiscussions,
      fetchingPinnedDiscussions,
      sortingMethod,
      error,
    } = this.props;

    if (error) {
      return (
        <div className={classnames(styles.errorMsg)}>
          {error}
        </div>
      );
    }

    return (
      <div className={classnames(appLayout.constraintWidth, styles.contentArea)}>
        <div className={appLayout.primaryContent}>
          <FeedBox
            type='pinned'
            loading={fetchingPinnedDiscussions}
            discussions={pinnedDiscussions}
            currentForum={currentForum}
          />

          <FeedBox
            type='general'
            loading={fetchingDiscussions}
            discussions={discussions}
            currentForum={currentForum}
            onChangeSortingMethod={this.handleSortingChange.bind(this)}
            activeSortingMethod={sortingMethod}
          />

          { this.renderNewDiscussionButtion() }
        </div>

        <div className={appLayout.secondaryContent}>
          <SideBar currentForum={currentForum} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    currentForum: state.app.currentForum,
    fetchingDiscussions: state.feed.fetchingDiscussions,
    discussions: state.feed.discussions,
    fetchingPinnedDiscussions: state.feed.fetchingPinnedDiscussions,
    sortingMethod: state.feed.sortingMethod,
    pinnedDiscussions: state.feed.pinnedDiscussions,
    error: state.feed.error,
  }; },
  (dispatch) => { return {
    getDiscussions: (currentForum, feedChanged, sortingMethod, sortingChanged) => { dispatch(getDiscussions(currentForum, feedChanged, sortingMethod, sortingChanged)); },
    getPinnedDiscussions: (currentForum, feedChanged) => { dispatch(getPinnedDiscussions(currentForum, feedChanged)); },
    updateSortingMethod: (method) => { dispatch(updateSortingMethod(method)); },
  }; }
)(ForumFeed);
