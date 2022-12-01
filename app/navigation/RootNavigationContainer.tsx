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
import {useTheme} from '@ui-kitten/components';
import AccountSettingsScreen from '@screens/Account/AccountSettingsScreen';
import TopNavigationHeader from './header/TopNavigationHeader';
import commonStackStyles from './style/commonStackStyles';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigationContainer: React.FC = () => {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <></>,
          contentStyle: {backgroundColor: theme['background-basic-color-1']},
          animation: 'slide_from_right',
        }}
        initialRouteName={AuthModel.isAuthenticated ? 'Main' : 'Login'}>
        <Stack.Screen name={'Login'} component={withAuthObserver(LoginStack)} />
        <Stack.Screen name={'Main'} component={withAuthObserver(Main)} />
        <Stack.Screen
          name={'Account'}
          component={withAuthObserver(AccountStack)}
        />
        <Stack.Screen
          name={'Settings'}
          component={AccountSettingsScreen}
          options={{
            contentStyle: commonStackStyles,
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
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default observer(RootNavigationContainer);
