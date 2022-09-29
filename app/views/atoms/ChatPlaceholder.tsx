import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ScaledSheet} from 'react-native-size-matters';
import SmoothView from './SmoothView';
import usePlaceholderColors from '@hooks/usePlaceholderColors';

const ChatPlaceholder: React.FC = () => {
  const {highlightColor, backgroundColor} = usePlaceholderColors();
  return (
    <SmoothView>
      <SkeletonPlaceholder {...{highlightColor, backgroundColor}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.avatar} />
          <View style={styles.chatBody}>
            <View style={styles.name} />
            <View style={styles.message} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </SmoothView>
  );
};

export const chatPlaceholderStyles = ScaledSheet.create({
  chatBody: {
    marginLeft: '8@s',
  },
  avatar: {
    width: '48@s',
    height: '48@s',
    borderRadius: '48@s',
  },
  avatarSmall: {
    width: '36@s',
    height: '36@s',
    borderRadius: '36@s',
  },
  name: {
    width: '80@s',
    height: '12@vs',
    borderRadius: '4@s',
    marginTop: '4@vs',
  },
  message: {
    marginTop: '4@vs',
    width: '120@s',
    height: '11@vs',
    borderRadius: '4@s',
  },
});

const styles = chatPlaceholderStyles;

export default ChatPlaceholder;
