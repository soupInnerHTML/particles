import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainTabs from './tabs/MainTabs';
import LoginStack from './stacks/LoginStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import {RootStackParamList} from './navigation';
import withAuthObserver from '../hoc/withAuthObserver';
import AccountStack from './stacks/AccountStack';
import AuthModel from '../models/AuthModel';
import Main from '../views_messanger/Chats';
import TopNavigationHeader from './header/TopNavigationHeader';
import Chat from '../views_messanger/Chat';
import PressableAccountAvatar from '../views/atoms/PressableAccountAvatar';
import generateAvatarPlaceholder from '../utils/generateAvatarPlaceholder';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import firestore from '@react-native-firebase/firestore';
import {IUserModel} from '../models/UserModel';

dayjs.extend(relativeTime);

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigationContainer: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <></>,
          contentStyle: {backgroundColor: '#fff'},
        }}
        initialRouteName={AuthModel.isAuthenticated ? 'Main' : 'Login'}>
        <Stack.Screen name={'Login'} component={withAuthObserver(LoginStack)} />
        {/*<Stack.Screen name={'Main'} component={withAuthObserver(MainTabs)} />*/}
        <Stack.Screen
          options={{
            header: ({route, options}) => (
              <TopNavigationHeader
                title={'Chats'}
                right={options.headerRight}
              />
            ),
          }}
          name={'Main'}
          component={withAuthObserver(Main)}
        />
        <Stack.Screen
          options={{
            header: ({route}) => <ChatHeader userId={route.params.userId} />,
          }}
          name={'Chat'}
          component={withAuthObserver(Chat)}
        />
        <Stack.Screen
          name={'Account'}
          component={withAuthObserver(AccountStack)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Some: React.FC<{userId: string}> = ({userId}) => {
  const [user, setUser] = useState<IUserModel>();
  useEffect(() => {
    (async () => {
      const snapshot = await firestore().collection('users').doc(userId).get();
      setUser(snapshot.data());
    })();
  }, [userId]);

  console.log(userId);

  return (
    <TopNavigationHeader
      title={user?.name}
      subtitle={'Last seen ' + dayjs.unix(user?.lastSeen?.seconds).fromNow()}
      right={
        <PressableAccountAvatar
          image={user?.avatar || generateAvatarPlaceholder(user?.name)}
        />
      }
      canGoBack
    />
  );
};

const ChatHeader = observer(Some);

export default observer(RootNavigationContainer);
