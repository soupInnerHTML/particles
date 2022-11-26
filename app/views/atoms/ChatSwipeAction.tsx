import React from 'react';
import {Animated} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {noop} from 'lodash';
import {Icon, Text} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';

export interface ISwipeAction {
  progress: Animated.AnimatedInterpolation;
  dragX: Animated.AnimatedInterpolation;
}

interface IChatSwipeActionProps {
  color: string;
  icon: string;
  text: string;
  outputInterpolate: [number, number];
}

const ChatSwipeAction: React.FC<ISwipeAction & IChatSwipeActionProps> = ({
  progress,
  color,
  icon,
  text,
  outputInterpolate,
}) => {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: outputInterpolate,
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={{
        transform: [{translateX}],
      }}>
      <RectButton
        style={[styles.action, {backgroundColor: color}]}
        onPress={noop}>
        <Icon name={icon} fill={'#fff'} width={32} height={32} />
        <Text category={'c2'}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
};

const styles = ScaledSheet.create({
  action: {
    height: '100%',
    width: '60@vs',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: '16@vs',
  },
});

export default ChatSwipeAction;
