import {Icon, IconProps} from '@ui-kitten/components';
import React from 'react';
import _ from 'lodash';
import {TouchableOpacity, View} from 'react-native';

function createIcon(name: string, onPress?: () => unknown) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (props: IconProps) => (
    <Wrapper onPress={onPress}>
      <Icon name={name} {...props} />
    </Wrapper>
  );
}

export default createIcon;
