import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusContainer from 'soapbox/containers/status_container';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PlaceholderStatus from 'soapbox/features/placeholder/components/placeholder_status';
import classNames from 'classnames';

const mapStateToProps = (state, { id }) => {
  return {
    replyToId: state.getIn(['contexts', 'inReplyTos', id]),
    replyCount: state.getIn(['contexts', 'replies', id], ImmutableOrderedSet()).size,
    isLoaded: Boolean(state.getIn(['statuses', id])),
  };
};

export default @connect(mapStateToProps)
class ThreadStatus extends React.Component {

  static propTypes = {
    focusedStatusId: PropTypes.string,
    replyToId: PropTypes.string,
    replyCount: PropTypes.number,
    isLoaded: PropTypes.bool,
  }

  renderConnector() {
    const { focusedStatusId, replyToId, replyCount } = this.props;

    const isConnectedTop = replyToId && replyToId !== focusedStatusId;
    const isConnectedBottom = replyCount > 0;
    const isConnected = isConnectedTop || isConnectedBottom;

    if (!isConnected) {
      return null;
    }

    return (
      <div
        className={classNames('thread__connector', {
          'thread__connector--top': isConnectedTop,
          'thread__connector--bottom': isConnectedBottom,
        })}
      />
    );
  }

  render() {
    const { isLoaded } = this.props;

    return (
      <div className='thread__status'>
        {this.renderConnector()}
        {isLoaded ? (
          <StatusContainer {...this.props} />
        ) : (
          <PlaceholderStatus />
        )}
      </div>
    );
  }

}
