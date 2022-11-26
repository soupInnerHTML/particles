import React, {useMemo} from 'react';
import {View} from 'react-native';
import Row from '@atoms/Row';
import ReadStatusIcon from '@atoms/ReadStatusIcon';
import {Text, useTheme} from '@ui-kitten/components';
import ChipsCounter from '@atoms/ChipsCounter';
import {ScaledSheet} from 'react-native-size-matters';
import dayjs from 'dayjs';
import {getDateRelativeToYear} from '@utils/index';
import {IMessage, MessageStatus} from '@models/mobx/ChatsModel';
import AccountModel from '@models/mobx/AccountModel';

interface IChatMetaProps {
  messageHistory: Maybe<IMessage[]>;
}

const ChatMeta: React.FC<IChatMetaProps> = ({messageHistory}) => {
  const theme = useTheme();
  const lastMessage = messageHistory?.[0];
  const unreadCount = messageHistory?.filter(
    message =>
      message.status === MessageStatus.UNREAD &&
      message.author?.id !== AccountModel.id,
  ).length;
  const relativeTime = useMemo(() => {
    if (lastMessage?.time?.seconds) {
      const unix = dayjs.unix(lastMessage.time.seconds);
      return unix.calendar(null, {
        sameDay: 'HH:mm',
        lastDay: 'ddd', // The day before ( Wed )
        lastWeek: 'ddd', // Last week ( Wed )
        sameElse: getDateRelativeToYear.bind(unix, 'DD.MM', 'DD.MM.YY'),
      });
    } else {
      return '';
    }
  }, [lastMessage?.time?.seconds]);
  return (
    <View style={styles.meta}>
      <Row alignItems={'flex-end'}>
        {!unreadCount && !!lastMessage && (
          <ReadStatusIcon
            status={lastMessage.status}
            fill={theme['color-primary-500']}
            width={16}
            height={16}
            marginRight={1}
          />
        )}
        <Text>{relativeTime}</Text>
      </Row>
      <ChipsCounter count={unreadCount} />
    </View>
  );
};

const styles = ScaledSheet.create({
  meta: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
});

export default ChatMeta;
