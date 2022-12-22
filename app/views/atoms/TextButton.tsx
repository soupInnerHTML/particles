import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Text, TextProps} from '@ui-kitten/components';

const TextButton: React.FC<TouchableOpacityProps & TextProps> = ({
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text status={'primary'}>{children}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;
