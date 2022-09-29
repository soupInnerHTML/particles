import React, {FC} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {observer} from 'mobx-react-lite';
import TopNavigationHeader from '../header/TopNavigationHeader';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const MainStackComponents: React.ComponentProps<typeof Tab.Screen>[] = [];

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
          component={screen.component as FC}
        />
      ))}
    </Tab.Navigator>
  );
};

export default observer(MainTabs);
