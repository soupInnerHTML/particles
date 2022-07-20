import React, {FC} from 'react';
import Posts from '../../views/screens/PostsScreen';
import PressableAccountAvatar from '../../views/atoms/PressableAccountAvatar';
import withContainer from '../../hoc/withContainer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {observer} from 'mobx-react-lite';
import AccountModel from '../../models/AccountModel';
import TopNavigationHeader from '../header/TopNavigationHeader';
import AddPostScreen from '../../views/screens/AddPostScreen';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const MainStackComponents: React.ComponentProps<typeof Tab.Screen>[] = [
    {
      name: 'Posts',
      component: Posts,
      options: {
        headerRight: withContainer(() => (
          <PressableAccountAvatar image={AccountModel.avatar} />
        )),
      },
    },
    {
      name: 'AddPost',
      component: AddPostScreen,
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Posts"
      screenOptions={{
        header: ({route, options}) => (
          <TopNavigationHeader title={route.name} right={options.headerRight} />
        ),
      }}>
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
