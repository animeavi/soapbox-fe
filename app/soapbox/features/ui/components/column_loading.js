import React from 'react';
import PropTypes from 'prop-types';
import Column from './column';
import ColumnHeader from '../../../components/column_header';
import ImmutablePureComponent from 'react-immutable-pure-component';
import LoadingIndicator from 'soapbox/components/loading_indicator';

export default class ColumnLoading extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    icon: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    icon: '',
  };

  render() {
    const { title, icon } = this.props;
    return (
      <Column>
        <ColumnHeader icon={icon} title={title} focusable={false} />
        <div className='column-loading'>
          <LoadingIndicator />
        </div>
      </Column>
    );
  }

}
