import React from 'react';
import {View} from 'react-native';
import {StyleService, Text, useStyleSheet} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';
import {IChatComponentsProps} from '@organisms/Chat';
import {useIsTyping} from '@hooks/useIsTyping';
import TypingSmoothReText from '@atoms/TypingSmoothReText';
import {ChatBodyMessageInfo} from '@molecules/ChatBodyMessageInfo';

const ChatBody: React.FC<IChatComponentsProps> = ({companion, lastMessage}) => {
  const isTyping = useIsTyping(companion?.id);
  const themedStyles = useStyleSheet(_themedStyles);
  return (
    <View style={styles.chatBody}>
      <Text>{companion?.name}</Text>
      {isTyping ? (
        <TypingSmoothReText
          style={[styles.chatMessage, themedStyles.typingText]}
        />
      ) : (
        <ChatBodyMessageInfo {...{companion, lastMessage}} />
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  chatBody: {
    marginLeft: '8@s',
    width: '75%',
  },
  chatMessage: {
    fontSize: '11@s',
    opacity: 0.7,
    marginTop: '4@vs',
  },
});

const _themedStyles = StyleService.create({
  typingText: {
    color: 'color-primary-default',
    opacity: 1,
  },
});

export default ChatBody;
