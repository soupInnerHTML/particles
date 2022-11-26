import React from 'react';
import {View} from 'react-native';
import {Text} from '@ui-kitten/components';
import Row from '@atoms/Row';
import ChipsText from '@atoms/ChipsText';
import {ScaledSheet} from 'react-native-size-matters';
import {IChatComponentsProps} from '@organisms/Chat';

const ChatBody: React.FC<IChatComponentsProps> = ({companion, lastMessage}) => {
  return (
    <View style={styles.chatBody}>
      <Text>{companion?.name}</Text>
      <Row alignItems={'baseline'}>
        {!!lastMessage?.photos && (
          <View style={styles.mediaChips}>
            <ChipsText>
              <Text style={styles.chatMessage}>
                {`🖼️ ${lastMessage.photos.length} ${
                  !lastMessage.text ? 'image' : ''
                }`}
              </Text>
            </ChipsText>
          </View>
        )}
        {!!lastMessage?.videos && (
          <View style={styles.mediaChips}>
            <ChipsText>
              <Text style={styles.chatMessage}>{`📹 ${2}`}</Text>
            </ChipsText>
          </View>
        )}
        <Text
          numberOfLines={2}
          style={[styles.chatMessage, !lastMessage?.text && {opacity: 1}]}
          status={lastMessage?.text ? 'control' : 'primary'}>
          {lastMessage?.text ?? '@' + companion?.shortName}
        </Text>
      </Row>
    </View>
  );
};

const styles = ScaledSheet.create({
  chatBody: {
    marginLeft: '8@s',
    width: '75%',
  },
  mediaChips: {
    marginRight: '4@s',
    marginTop: '4@vs',
  },
  chatMessage: {
    fontSize: '11@s',
    opacity: 0.7,
    marginTop: '4@vs',
  },
});

export default ChatBody;
