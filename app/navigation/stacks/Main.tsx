import React from 'react';
import TopNavigationHeader from '../header/TopNavigationHeader';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatsScreen from '../../views/screens/Chats/ChatsScreen';
import Chat from '../../views/screens/Chat/ChatScreen';
import ChatHeader from '../header/ChatHeader';
import {MainStackParamList} from '../navigation';
import {StyleProp, ViewStyle} from 'react-native';
import {Input} from '@ui-kitten/components';
import ChatsSearchInput from '@atoms/ChatsSearchInput';

const Stack = createNativeStackNavigator<MainStackParamList>();

const chatsStyles: StyleProp<ViewStyle> = {
  marginHorizontal: 0,
  backgroundColor: '#fff',
};

const Main: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Chats"
      screenOptions={{
        contentStyle: chatsStyles,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name={'Chats'}
        component={ChatsScreen}
        options={{
          header: ({options}) => (
            <TopNavigationHeader title={'Chats'} right={options.headerRight}>
              <ChatsSearchInput />
            </TopNavigationHeader>
          ),
        }}
      />
      <Stack.Screen
        name={'Chat'}
        component={Chat}
        options={{
          header: ({route}) => <ChatHeader userId={route.params.userId} />,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;
