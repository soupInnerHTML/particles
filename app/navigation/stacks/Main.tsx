import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatsScreen from '../../views/screens/Chats/ChatsScreen';
import Chat from '../../views/screens/Chat/ChatScreen';
import ChatHeader from '../header/ChatHeader';
import {MainStackParamList} from '../navigation.types';
import {StyleProp, ViewStyle} from 'react-native';
import useAppNavigation from '@hooks/useAppNavigation';
import ChatsHeader from '../header/ChatsHeader';
import TextButton from '@atoms/TextButton';

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
          header: ({options}) => <ChatsHeader right={options.headerRight} />,
          headerRight: () => {
            const navigation = useAppNavigation();
            return (
              <TextButton onPress={() => navigation.navigate('Settings')}>
                Settings
              </TextButton>
            );
          },
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
