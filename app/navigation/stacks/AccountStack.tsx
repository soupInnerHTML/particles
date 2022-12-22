import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from '../../views/screens/Account/AccountScreen';
import TopNavigationHeader from '../header/TopNavigationHeader';
import commonStackStyles from '../style/commonStackStyles';
import {Icon, TopNavigationAction} from '@ui-kitten/components';
import useAppNavigation from '../../hooks/useAppNavigation';
import {useRoute} from '@react-navigation/native';
import {IRoute} from '../navigation';
import AccountModel from '@models/mobx/AccountModel';

const Stack = createNativeStackNavigator();

const AccountMainRight = () => {
  const navigation = useAppNavigation();
  const route = useRoute<IRoute<'Account'>>();
  return route.params.id === AccountModel.id ? (
    <TopNavigationAction
      onPress={() => navigation.navigate('Settings')}
      icon={<Icon name="settings" />}
    />
  ) : (
    <></>
  );
};

const AccountStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        contentStyle: commonStackStyles,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        header: ({back, navigation, options}) => {
          return (
            <TopNavigationHeader
              right={options.headerRight}
              canGoBack={back?.title || navigation.canGoBack()}
              title={''}
              subtitle={''}
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
      {/*<Stack.Screen*/}
      {/*  name={'AccountSettings'}*/}
      {/*  component={AccountSettingsScreen}*/}
      {/*/>*/}
    </Stack.Navigator>
  );
};

export default AccountStack;
