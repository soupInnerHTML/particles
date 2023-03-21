import React from 'react';
import {Icon, IconProps} from '@ui-kitten/components';
import {MessageStatus} from '@models/mobx/ChatsModel';

const ReadStatusIcon = (props: IconProps & {status: MessageStatus}) => {
  return (
    <Icon
      name={
        props.status === MessageStatus.READ
          ? 'done-all-outline'
          : 'checkmark-outline'
      }
      {...props}
    />
  );
};

export default React.memo(ReadStatusIcon);
