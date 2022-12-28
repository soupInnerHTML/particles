import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Text, TextProps} from '@ui-kitten/components';

const TextButton: React.FC<TouchableOpacityProps & TextProps> = ({
  children,
  onPress,
  disabled,
  status = 'primary',
  ...props
}) => {
  return (
    <TouchableOpacity {...{disabled, onPress}} {...props}>
      <Text status={disabled ? undefined : status} appearance={'hint'}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
