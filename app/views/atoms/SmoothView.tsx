import React from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {ViewProps} from 'react-native';

const SmoothView: React.FC<ViewProps> = ({children, ...props}) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} {...props}>
      {children}
    </Animated.View>
  );
};

export default SmoothView;
