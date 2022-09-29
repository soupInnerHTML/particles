import React, {useMemo} from 'react';
import {IChat, MessageStatus} from '../../models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import AccountModel from '../../models/mobx/AccountModel';
import {useNavigation} from '@react-navigation/native';
import {INavigation} from '../../navigation/navigation';
import AuthModel from '../../models/mobx/AuthModel';
import Ripple from 'react-native-material-ripple';
import {Avatar, Text, useTheme} from '@ui-kitten/components';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';
import {TouchableHighlight, TouchableOpacity, View} from 'react-native';
import dayjs from 'dayjs';
import {ScaledSheet} from 'react-native-size-matters';
import ChipsCounter from '../atoms/ChipsCounter';
import Row from '../atoms/Row';
import ReadStatusIcon from '../atoms/ReadStatusIcon';
import ChipsText from '../atoms/ChipsText';
import OnlineStatus from '../atoms/OnlineStatus';
import useIsOnline from '../../hooks/useIsOnline';
import useFirestoreUser from '../../hooks/useFirestoreUser';
import ChatPlaceholder from '../atoms/ChatPlaceholder';
import SmoothView from '../atoms/SmoothView';
import {getDateRelativeToYear} from '../../utils';

const Chat: React.FC<IChat> = ({members, messageHistory, id}) => {
  const companionRef = members.find(member => member.id !== AccountModel.id);
  const companion = useFirestoreUser(companionRef?.id ?? members[0].id);

  const lastMessage = messageHistory[0];
  const unreadCount = messageHistory.filter(
    message =>
      message.status === MessageStatus.UNREAD &&
      message.author?.id !== AccountModel.id,
  ).length;
  const navigation = useNavigation<INavigation<'Main'>>();
  const theme = useTheme();
  const isOnline = useIsOnline(companion?.lastSeen?.seconds ?? 0);

  const relativeTime = useMemo(() => {
    const unix = dayjs.unix(lastMessage?.time?.seconds);
    return unix.calendar(null, {
      sameDay: 'hh:mm',
      lastDay: 'ddd', // The day before ( Wed )
      lastWeek: 'ddd', // Last week ( Wed )
      sameElse: getDateRelativeToYear.bind(unix, 'DD.MM', 'DD.MM.YY'),
    });
  }, [lastMessage?.time?.seconds]);

  return companion && AuthModel.isAuthenticated ? (
    <SmoothView>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.chat]}
        onPress={() =>
          companion &&
          navigation.navigate('Chat', {
            userId: companionRef.id,
            id,
          })
        }>
        <>
          <View>
            <Avatar
              source={{
                uri:
                  companion?.avatar ||
                  generateAvatarPlaceholder(companion?.name, companion?.color),
              }}
              style={styles.avatar}
            />
            <OnlineStatus online={isOnline} />
          </View>
          <View style={styles.chatBody}>
            <Text>{companion?.name}</Text>
            <Row alignItems={'baseline'}>
              {!!lastMessage.photos && (
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
              {!!lastMessage.videos && (
                <View style={styles.mediaChips}>
                  <ChipsText>
                    <Text style={styles.chatMessage}>{`📹 ${2}`}</Text>
                  </ChipsText>
                </View>
              )}
              <Text numberOfLines={2} style={styles.chatMessage}>
                {lastMessage.text}
              </Text>
            </Row>
          </View>
          <View style={styles.meta}>
            <Row alignItems={'flex-end'}>
              {!unreadCount && (
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
        </>
      </TouchableOpacity>
    </SmoothView>
  ) : (
    <View style={styles.chat}>
      <ChatPlaceholder />
    </View>
  );
};

const styles = ScaledSheet.create({
  chat: {
    paddingHorizontal: '8@s',
    paddingVertical: '8@vs',
    flexDirection: 'row',
    height: '60@vs',
  },
  avatar: {
    height: '40@vs',
    width: '40@vs',
  },
  chatBody: {
    marginLeft: '8@s',
    width: '75%',
  },
  chatMessage: {
    fontSize: '11@s',
    opacity: 0.7,
    marginTop: '4@vs',
  },
  counter: {
    backgroundColor: '#0292f9',
    paddingHorizontal: '8@s',
    paddingVertical: '4@vs',
    borderRadius: '16@s',
    alignSelf: 'flex-end',
    marginTop: '4@vs',
  },
  counterText: {
    color: '#fff',
  },
  meta: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  mediaChips: {marginRight: '4@s', marginTop: '4@vs'},
});

export default observer(Chat);
