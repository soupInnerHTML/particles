import React from 'react';
import {IMessagePayload} from '@models/mobx/ChatsModel';
import {s, ScaledSheet} from 'react-native-size-matters';
import Animated, {
  Layout,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {Image, TouchableOpacity} from 'react-native';

const PHOTO_SIZE = s(50);
const PHOTO_VERTICAL_INDENT = s(8);

const ChatAttachment: React.FC<
  IMessagePayload & {removeItem: (index: number) => unknown}
> = ({
  // videos,
  photos,
  removeItem,
}) => {
  const height = useSharedValue(0);
  useAnimatedReaction(
    () => photos?.length,
    prepare => {
      height.value = withTiming(
        prepare ? PHOTO_SIZE + PHOTO_VERTICAL_INDENT * 2 : 0,
      );
    },
  );
  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));
  return (
    <Animated.View style={style}>
      <Animated.FlatList
        keyExtractor={item => item.uri}
        itemLayoutAnimation={Layout.springify().damping(12)}
        style={styles.list}
        horizontal
        data={photos}
        renderItem={({item: photo, index}) => {
          return (
            <TouchableOpacity
              onLongPress={() => removeItem(index)}
              key={photo.base64}>
              <Animated.View
                style={styles.attachment}
                entering={ZoomIn}
                exiting={ZoomOut}>
                <Image
                  source={{uri: 'data:image/png;base64,' + photo.base64}}
                  style={styles.image}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
};

const styles = ScaledSheet.create({
  attachment: {
    marginLeft: '4@s',
    marginBottom: '4@vs',
  },
  image: {
    width: PHOTO_SIZE,
    height: '50@s',
    marginRight: '4@s',
    borderRadius: '8@s',
    marginVertical: PHOTO_VERTICAL_INDENT,
  },
  list: {
    paddingHorizontal: '4@s',
  },
});

export default ChatAttachment;
