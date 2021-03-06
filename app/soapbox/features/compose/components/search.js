import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Overlay from 'react-overlays/lib/Overlay';
import Motion from '../../ui/util/optional_motion';
import spring from 'react-motion/lib/spring';
import Icon from 'soapbox/components/icon';
import classNames from 'classnames';

const messages = defineMessages({
  placeholder: { id: 'search.placeholder', defaultMessage: 'Search' },
});

class SearchPopout extends React.PureComponent {

  static propTypes = {
    style: PropTypes.object,
  };

  render() {
    const { style } = this.props;
    const extraInformation = <FormattedMessage id='search_popout.tips.full_text' defaultMessage='Simple text returns posts you have written, favorited, reposted, or have been mentioned in, as well as matching usernames, display names, and hashtags.' />;
    return (
      <div className='search-popout-container' style={{ ...style, position: 'absolute', zIndex: 1000 }}>
        <Motion defaultStyle={{ opacity: 0, scaleX: 1, scaleY: 1 }} style={{ opacity: spring(1, { damping: 35, stiffness: 400 }), scaleX: spring(1, { damping: 35, stiffness: 400 }), scaleY: spring(1, { damping: 35, stiffness: 400 }) }}>
          {({ opacity, scaleX, scaleY }) => (
            <div className='search-popout' style={{ opacity: opacity, transform: `scale(${scaleX}, ${scaleY})` }}>
              <h4><FormattedMessage id='search_popout.search_format' defaultMessage='Advanced search format' /></h4>
              <ul>
                <li><em>#example</em> <FormattedMessage id='search_popout.tips.hashtag' defaultMessage='hashtag' /></li>
                <li><em>@username</em> <FormattedMessage id='search_popout.tips.user' defaultMessage='user' /></li>
                <li><em>URL</em> <FormattedMessage id='search_popout.tips.user' defaultMessage='user' /></li>
                <li><em>URL</em> <FormattedMessage id='search_popout.tips.status' defaultMessage='post' /></li>
              </ul>
              {extraInformation}
            </div>
          )}
        </Motion>
      </div>
    );
  }

}

export default @injectIntl
class Search extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    openInRoute: PropTypes.bool,
    autoFocus: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoFocus: false,
  }

  state = {
    expanded: false,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  handleClear = (e) => {
    e.preventDefault();

    if (this.props.value.length > 0 || this.props.submitted) {
      this.props.onClear();
    }
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      this.props.onSubmit();

      if (this.props.openInRoute) {
        this.context.router.history.push('/search');
      }
    } else if (e.key === 'Escape') {
      document.querySelector('.ui').parentElement.focus();
    }
  }

  handleFocus = () => {
    this.setState({ expanded: true });
    this.props.onShow();
  }

  handleBlur = () => {
    this.setState({ expanded: false });
  }

  render() {
    const { intl, value, autoFocus, submitted } = this.props;
    const { expanded } = this.state;
    const hasValue = value.length > 0 || submitted;

    return (
      <div className='search'>
        <label>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.placeholder)}</span>
          <input
            className='search__input'
            type='text'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            autoFocus={autoFocus}
          />
        </label>
        <div role='button' tabIndex='0' className='search__icon' onClick={this.handleClear}>
          <Icon src={require('@tabler/icons/icons/search.svg')} className={classNames('svg-icon--search', { active: !hasValue })} />
          <Icon src={require('@tabler/icons/icons/backspace.svg')} className={classNames('svg-icon--backspace', { active: hasValue })} aria-label={intl.formatMessage(messages.placeholder)} />
        </div>
        <Overlay show={expanded && !hasValue} placement='bottom' target={this}>
          <SearchPopout />
        </Overlay>
      </div>
    );
  }

}
