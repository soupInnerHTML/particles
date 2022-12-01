import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {Icon, Input, Text} from '@ui-kitten/components';
import {s, ScaledSheet} from 'react-native-size-matters';
import Row from './Row';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useIsFocused} from '@react-navigation/native';
import SearchChatsModel from '@models/mobx/SearchChatsModel';
import Animated, {
  Easing,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const CONTAINER_HORIZONTAL_MARGIN = s(8);
const CANCEL_MARGIN_LEFT = s(8);

interface IChatsSearchInputProps {
  setIsFocused: Dispatch<SetStateAction<boolean>>;
  isCancelVisible: boolean;
}

const ChatsSearchInput: React.FC<IChatsSearchInputProps> = ({
  setIsFocused,
  isCancelVisible,
}) => {
  const isNavigationFocused = useIsFocused();
  const {setSearchQuery, searchQuery} = SearchChatsModel;
  const inputRef = useAnimatedRef<Input>();
  const cancelRef = useAnimatedRef<TouchableOpacity>();

  function cancel() {
    inputRef.current?.blur();
    setSearchQuery('');
  }

  useEffect(() => {
    if (!isNavigationFocused) {
      cancel();
    }
  }, [isNavigationFocused]);

  const {width: windowWidth} = useWindowDimensions();
  const inputWidth = windowWidth - CONTAINER_HORIZONTAL_MARGIN * 2;
  const cancelWidth = useDerivedValue(() => {
    return measure(cancelRef)?.width ?? 0;
  }, [isCancelVisible]);

  const inputStyle = useAnimatedStyle(() => ({
    width: withTiming(
      isCancelVisible
        ? inputWidth - cancelWidth.value - CANCEL_MARGIN_LEFT
        : inputWidth,
      {easing: Easing.inOut(Easing.ease)},
    ),
  }));

  return (
    <Row
      style={styles.container}
      alignItems={'center'}
      justifyContent={'space-between'}>
      <Animated.View style={inputStyle}>
        <Input
          blurOnSubmit
          value={searchQuery}
          ref={inputRef}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessoryLeft={props => <Icon {...props} name={'search'} />}
          placeholder={'Search for chats'}
          size={'small'}
          style={styles.input}
        />
      </Animated.View>
      <TouchableOpacity ref={cancelRef} style={styles.cancel} onPress={cancel}>
        <Text status={'primary'}>Cancel</Text>
      </TouchableOpacity>
    </Row>
  );
};

const styles = ScaledSheet.create({
  container: {
    marginHorizontal: CONTAINER_HORIZONTAL_MARGIN,
    // marginTop: '-8@vs',
    marginBottom: '8@vs',
  },
  input: {
    borderRadius: '8@s',
    flexGrow: 1,
  },
  cancel: {
    marginLeft: CANCEL_MARGIN_LEFT,
  },
});

export default observer(ChatsSearchInput);
