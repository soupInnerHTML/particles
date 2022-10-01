import React, {useEffect, useMemo} from 'react';
import {ListRenderItem, View} from 'react-native';
import Animated, {Layout} from 'react-native-reanimated';
import ChatsModel, {IMessage} from '@models/mobx/ChatsModel';
import dayjs from 'dayjs';
import {getDateRelativeToYear} from '@utils/index';
import ChipsText from '@atoms/ChipsText';
import Message from '@molecules/Message';
import {ScaledSheet} from 'react-native-size-matters';
import {useRoute} from '@react-navigation/native';
import {IRoute} from '../../navigation/navigation';
import calendar from 'dayjs/plugin/calendar';
import {observer} from 'mobx-react-lite';

dayjs.extend(calendar);

const renderItem: ListRenderItem<IMessage | string> = ({item}) =>
  typeof item === 'string' ? (
    <View style={styles.timeChips}>
      <ChipsText>{item}</ChipsText>
    </View>
  ) : (
    <Message {...item} />
  );

const keyExtractor = (item: string | IMessage) =>
  typeof item === 'string' ? item : item.time.seconds.toString();

const ChatMessages: React.FC = () => {
  const {
    params: {id},
  } = useRoute<IRoute<'Chat'>>();
  const {messageHistory} = ChatsModel.data.find(chat => chat.id === id) || {};

  useEffect(() => {
    ChatsModel.readMessages(id);
  }, [messageHistory?.length]);

  const sections = useMemo(() => {
    const mappedMessages: Record<string, IMessage[]> = {};
    messageHistory?.forEach(message => {
      const unix = dayjs.unix(message.time.seconds);
      const date = unix.calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]', // The day before ( Yesterday )
        lastWeek: 'dddd', // Last week ( Monday )
        sameElse: getDateRelativeToYear.bind(unix, 'MMMM DD', 'MMMM DD, YYYY'),
      });
      mappedMessages[date] = [...(mappedMessages[date] || []), message];
    });

    const parsed = [];
    for (let key in mappedMessages) {
      parsed.push(...mappedMessages[key], key);
    }
    return parsed;
  }, [messageHistory]);

  return (
    <Animated.FlatList
      {...{keyExtractor, renderItem}}
      inverted
      itemLayoutAnimation={Layout.springify()}
      data={sections}
    />
  );
};

const styles = ScaledSheet.create({
  timeChips: {
    transform: [{rotateZ: '180deg'}, {rotateY: '180deg'}],
    alignSelf: 'center',
    marginVertical: '4@vs',
  },
});

export default observer(ChatMessages);
