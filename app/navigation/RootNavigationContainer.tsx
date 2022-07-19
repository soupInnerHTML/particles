import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainTabs from './tabs/MainTabs';
import LoginStack from './stacks/LoginStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import AccountModel from '../models/AccountModel';
import {RootStackParamList} from './navigation';
import withAuthObserver from '../hoc/withAuthObserver';
import AccountStack from './stacks/AccountStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigationContainer: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => {},
        }}
        initialRouteName={AccountModel.isAuthenticated ? 'Main' : 'Login'}>
        <Stack.Screen name={'Login'} component={withAuthObserver(LoginStack)} />
        <Stack.Screen name={'Main'} component={withAuthObserver(MainTabs)} />
        <Stack.Screen
          name={'Account'}
          component={withAuthObserver(AccountStack)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default observer(RootNavigationContainer);
