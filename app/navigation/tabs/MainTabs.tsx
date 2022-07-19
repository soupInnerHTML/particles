import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Posts from '../../views/screens/PostsScreen';
import {MainStackParamList} from '../navigation';
import PressableAccountAvatar from '../../views/atoms/PressableAccountAvatar';
import withContainer from '../../hoc/withContainer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {observer} from 'mobx-react-lite';
import AccountModel from '../../models/AccountModel';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const MainStackComponents: React.ComponentProps<typeof Stack.Screen>[] = [
    {
      name: 'Posts',
      component: Posts,
      options: {
        headerRight: withContainer(() => (
          <PressableAccountAvatar image={AccountModel.avatar} />
        )),
      },
    },
  ];

  return (
    <Tab.Navigator initialRouteName="Posts">
      {MainStackComponents.map(screen => (
        <Tab.Screen
          key={screen.name}
          {...screen}
          component={withContainer(screen.component as FC)}
        />
      ))}
    </Tab.Navigator>
  );
};

export default observer(MainTabs);
