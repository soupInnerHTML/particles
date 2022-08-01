import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from '../../views/screens/Account/AccountScreen';
import TopNavigationHeader from '../header/TopNavigationHeader';
import commonStackStyles from '../style/commonStackStyles';
import {Icon, TopNavigationAction} from '@ui-kitten/components';
import useAppNavigation from '../../hooks/useAppNavigation';
import AccountSettingsScreen from '../../views/screens/Account/AccountSettingsScreen';

const Stack = createNativeStackNavigator();

const AccountMainRight = () => {
  const navigation = useAppNavigation();
  return (
    <TopNavigationAction
      onPress={() => navigation.navigate('AccountSettings')}
      icon={<Icon name="settings" />}
    />
  );
};

const AccountStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        contentStyle: commonStackStyles,
        header: ({back, navigation, options, route}) => {
          return (
            <TopNavigationHeader
              right={options.headerRight}
              canGoBack={back?.title || navigation.canGoBack()}
              title={route.name}
              subtitle={'@rubysoho'}
            />
          );
        },
      }}>
      <Stack.Screen
        options={{
          headerRight: () => <AccountMainRight />,
        }}
        name={'Profile'}
        component={AccountScreen}
      />
      <Stack.Screen
        name={'AccountSettings'}
        component={AccountSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
