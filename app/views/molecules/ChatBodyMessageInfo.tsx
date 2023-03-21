import React from 'react';
import {IChatComponentsProps} from '@organisms/Chat';
import {withSmooth} from '@hoc/withSmooth';
import Row from '@atoms/Row';
import {View} from 'react-native';
import ChipsText from '@atoms/ChipsText';
import {Text} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';

export const ChatBodyMessageInfo: React.FC<IChatComponentsProps> = withSmooth(
  ({lastMessage, companion}) => {
    return (
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
    );
  },
);

const styles = ScaledSheet.create({
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
