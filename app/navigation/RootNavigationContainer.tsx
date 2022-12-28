import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './stacks/LoginStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import {RootStackParamList} from './navigation';
import withAuthObserver from '../hoc/withAuthObserver';
import AccountStack from './stacks/AccountStack';
import AuthModel from '../models/mobx/AuthModel';
import Main from './stacks/Main';
import AccountSettingsScreen from '@screens/Account/AccountSettingsScreen';
import TopNavigationHeader from './header/TopNavigationHeader';
import commonStackStyles from './style/commonStackStyles';
import useBackgroundColor from '@hooks/useBackgroundColor';
import {useStyleSheet} from '@ui-kitten/components';
import SettingsRight from './SettingsRight';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigationContainer: React.FC = () => {
  const backgroundColor = useBackgroundColor();
  const themed = useStyleSheet(commonStackStyles);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <></>,
          contentStyle: {backgroundColor},
          animation: 'slide_from_right',
        }}
        initialRouteName={AuthModel.isAuthenticated ? 'Main' : 'Login'}>
        <Stack.Screen name={'Login'} component={withAuthObserver(LoginStack)} />
        <Stack.Screen name={'Main'} component={withAuthObserver(Main)} />
        <Stack.Screen
          name={'Account'}
          options={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
          }}
          component={withAuthObserver(AccountStack)}
        />
        <Stack.Screen
          name={'Settings'}
          component={withAuthObserver(AccountSettingsScreen)}
          initialParams={{
            save: 0,
            valid: true,
            changed: false,
          }}
          options={{
            contentStyle: themed.stack,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            headerRight: () => <SettingsRight />,
            header: ({back, navigation, options}) => {
              return (
                <TopNavigationHeader
                  right={options.headerRight}
                  canGoBack={back?.title || navigation.canGoBack()}
                  title={'Settings'}
                  subtitle={''}
                />
              );
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default observer(RootNavigationContainer);
