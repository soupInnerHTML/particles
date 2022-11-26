import React, {useRef} from 'react';
import ChatsModel, {IChat, IMessage} from '@models/mobx/ChatsModel';
import {observer} from 'mobx-react-lite';
import AccountModel, {IUserModel} from '@models/mobx/AccountModel';
import {useNavigation} from '@react-navigation/native';
import {INavigation} from '../../navigation/navigation';
import {Layout} from '@ui-kitten/components';
import {Alert, Animated, LogBox, TouchableHighlight} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import useFirestoreUser from '@hooks/useFirestoreUser';
import SmoothView from '@atoms/SmoothView';
import useFirestoreMessageHistory from '@hooks/useFirestoreMessageHistory';
import {Swipeable} from 'react-native-gesture-handler';
import ChatSwipeAction from '@atoms/ChatSwipeAction';
import ChatBody from '@molecules/ChatBody';
import ChatAvatar from '@molecules/ChatAvatar';
import ChatMeta from '@molecules/ChatMeta';
import showContextActions from '@utils/showContextActions';
import {noop} from 'lodash';
import vibrate from '@utils/vibrate';

LogBox.ignoreAllLogs();

const renderRightActions = (
  progress: Animated.AnimatedInterpolation,
  dragX: Animated.AnimatedInterpolation,
) => {
  return (
    <>
      <ChatSwipeAction
        color={'#3366FF'}
        icon={'book-outline'}
        text={'Read'}
        outputInterpolate={[60, 0]}
        {...{progress, dragX}}
      />
      <ChatSwipeAction
        color={'#ffab00'}
        icon={'volume-off-outline'}
        text={'Mute'}
        outputInterpolate={[120, 0]}
        {...{progress, dragX}}
      />
    </>
  );
};

const renderLeftActions = (
  progress: Animated.AnimatedInterpolation,
  dragX: Animated.AnimatedInterpolation,
) => {
  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#DB3912',
      }}>
      <ChatSwipeAction
        color={'transparent'}
        icon={'trash-outline'}
        text={'Delete'}
        outputInterpolate={[0, 0]}
        {...{progress, dragX}}
      />
    </Animated.View>
  );
};

export interface IChatComponentsProps {
  companion: IUserModel | undefined;
  lastMessage: IMessage | undefined;
}

const Chat: React.FC<IChat> = ({members, id}) => {
  const companionRef =
    members.find(member => member.id !== AccountModel.id) ?? AccountModel.ref!;
  const companion = useFirestoreUser(companionRef.id);

  const messageHistory = useFirestoreMessageHistory(id);
  const lastMessage = messageHistory?.[0];
  const navigation = useNavigation<INavigation<'Main'>>();

  const swipe = useRef<Swipeable>(null);

  function askDeleteChat(onTrue: () => unknown) {
    Alert.alert(
      'Are you sure you want to delete chat?',
      'These action cannot be undone',
      [
        {
          text: 'Cancel',
          onPress: () => swipe.current?.close(),
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: onTrue,
        },
      ],
    );
  }

  return (
    <Swipeable
      ref={swipe}
      onSwipeableLeftOpen={() => {
        vibrate();
        askDeleteChat(() => ChatsModel.deleteChat(id));
      }}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}>
      <Layout>
        <SmoothView>
          <TouchableHighlight
            onLongPress={() => {
              showContextActions([
                {
                  title: 'Delete',
                  callback: () =>
                    askDeleteChat(() => ChatsModel.deleteChat(id)),
                  destructive: true,
                },
                {
                  title: 'Read',
                  callback: noop,
                },
                {
                  title: 'Mute',
                  callback: noop,
                },
              ]);
            }}
            underlayColor={'rgba(0, 0, 0, .2)'}
            style={styles.chat}
            onPress={() =>
              companion &&
              navigation.navigate('Chat', {
                userId: companionRef!.id,
                id,
              })
            }>
            <React.Fragment>
              <ChatAvatar {...{companion}} />
              <ChatBody {...{companion, lastMessage}} />
              <ChatMeta {...{messageHistory}} />
            </React.Fragment>
          </TouchableHighlight>
        </SmoothView>
      </Layout>
    </Swipeable>
  );
};

const styles = ScaledSheet.create({
  chat: {
    paddingHorizontal: '8@s',
    paddingVertical: '8@vs',
    flexDirection: 'row',
    height: '60@vs',
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
  deleteAction: {},
  muteAction: {
    backgroundColor: '#ffab00',
  },
  readAction: {
    backgroundColor: 'color-primary-default',
  },
});

export const chatStyles = styles;

export default observer(Chat);
