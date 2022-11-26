import React, {useEffect, useState} from 'react';
import {Icon, Input, Text} from '@ui-kitten/components';
import {s, ScaledSheet} from 'react-native-size-matters';
import Row from './Row';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useIsFocused} from '@react-navigation/native';
import SearchChatsModel from '@models/mobx/SearchChatsModel';
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const CONTAINER_HORIZONTAL_MARGIN = s(8);
const CANCEL_MARGIN_LEFT = s(8);

const ChatsSearchInput: React.FC = () => {
  const isNavigationFocused = useIsFocused();
  const [isFocused, setIsFocused] = useState(false);
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

  const isCancelVisible = isFocused || searchQuery;

  const {width} = useWindowDimensions();
  const inputWidth = useSharedValue(width - CONTAINER_HORIZONTAL_MARGIN * 2);
  const inputStyle = useAnimatedStyle(() => ({
    width: inputWidth.value,
  }));

  useAnimatedReaction(
    () => isCancelVisible,
    (visible, prev) => {
      if (prev !== null && visible !== prev) {
        const cancelMeasured = measure(cancelRef);
        const inputMeasured = measure(inputRef);
        if (cancelMeasured && inputMeasured) {
          const computedWidth = visible
            ? inputMeasured.width - cancelMeasured.width - CANCEL_MARGIN_LEFT
            : inputMeasured.width + cancelMeasured.width + CANCEL_MARGIN_LEFT;
          inputWidth.value = withTiming(computedWidth);
        }
      }
    },
  );

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
    marginTop: '-8@vs',
    marginBottom: '8@vs',
  },
  input: {
    borderRadius: '16@s',
    flexGrow: 1,
  },
  cancel: {
    marginLeft: CANCEL_MARGIN_LEFT,
  },
});

export default observer(ChatsSearchInput);
