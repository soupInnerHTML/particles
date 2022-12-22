import React, {useRef} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ChatsModel from '@models/mobx/ChatsModel';
import {chatStyles} from '@organisms/Chat';
import ChatPlaceholder from '@atoms/ChatPlaceholder';
import LottieView from 'lottie-react-native';
import {Button, Text} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';
import SearchChatsModel from '@models/mobx/SearchChatsModel';
import EmptyAnim from '@anim/empty.json';
import useLottieEternal from '@hooks/useLottieEternal';

const EmptyChats: React.FC = () => {
  const ref = useLottieEternal();
  return ChatsModel.isPending || SearchChatsModel.isPending ? (
    <React.Fragment>
      <View style={chatStyles.chat}>
        <ChatPlaceholder />
      </View>
      <View style={chatStyles.chat}>
        <ChatPlaceholder />
      </View>
      <View style={chatStyles.chat}>
        <ChatPlaceholder />
      </View>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <View style={styles.lottie}>
        <LottieView
          ref={ref}
          source={EmptyAnim}
          style={{height: '100%'}}
          autoPlay
          loop
        />
      </View>
      <Text category={'h3'} style={styles.emptyTitle}>
        Chats not found
      </Text>
      <Text category={'h6'} style={styles.emptyDesc}>
        {SearchChatsModel.searchQuery
          ? 'Check if the search query is correct'
          : 'You can search some buddies\n or just people idk'}
      </Text>
      {!SearchChatsModel.searchQuery && (
        <Button
          style={styles.btn}
          onPress={() => SearchChatsModel.setSearchQuery('@test_bot')}>
          Search
        </Button>
      )}
    </React.Fragment>
  );
};

const styles = ScaledSheet.create({
  lottie: {
    flex: 1,
    marginTop: '15%',
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: '30@vs',
  },
  emptyDesc: {
    textAlign: 'center',
    marginTop: '8@vs',
  },
  btn: {
    width: '50%',
    alignSelf: 'center',
    marginTop: '32@vs',
  },
});

export default observer(EmptyChats);
