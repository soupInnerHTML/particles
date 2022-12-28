import React, {FC, useState} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import ChatsSearchInput from '@atoms/ChatsSearchInput';
import TopNavigationHeader, {IHeaderProps} from './TopNavigationHeader';
import SearchChatsModel from '@models/mobx/SearchChatsModel';
import {observer} from 'mobx-react-lite';
import {vs} from 'react-native-size-matters';

const HEADER_HEIGHT = vs(45);

const ChatsHeader: React.FC<IMaybe<IHeaderProps>> = ({right}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isCancelVisible = isFocused || !!SearchChatsModel.searchQuery;
  const withCancelTiming = (
    trueValue: number,
    falseValue: number,
    userConfig?: WithTimingConfig,
  ) => {
    'worklet';
    return (isCancelVisible ? withTiming : withSpring)(
      isCancelVisible ? trueValue : falseValue,
      {
        easing: Easing.inOut(Easing.ease),
        ...userConfig,
      },
    );
  };
  const wrapperStyle = useAnimatedStyle(() => {
    return {
      height: withCancelTiming(0, HEADER_HEIGHT),
      opacity: withCancelTiming(0.2, 1, {duration: 100}),
      transform: [{translateY: withCancelTiming(-HEADER_HEIGHT * 2, 0)}],
    };
  });

  const Wrapper: FC = ({children}) => {
    return <Animated.View style={wrapperStyle}>{children}</Animated.View>;
  };

  return (
    <TopNavigationHeader title={'Chats'} {...{Wrapper, right}}>
      <ChatsSearchInput {...{setIsFocused, isCancelVisible}} />
    </TopNavigationHeader>
  );
};

export default observer(ChatsHeader);
