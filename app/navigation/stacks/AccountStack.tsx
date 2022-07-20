import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import withContainer from '../../hoc/withContainer';
import AccountScreen from '../../views/screens/AccountScreen';
import TopNavigationHeader from '../header/TopNavigationHeader';
import commonStackStyles from '../style/commonStackStyles';

const Stack = createNativeStackNavigator();

const AccountStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountMain"
      screenOptions={{
        contentStyle: commonStackStyles,
        header: ({back, navigation}) => {
          return (
            <TopNavigationHeader
              canGoBack={back?.title || navigation.canGoBack()}
              title={'Account'}
            />
          );
        },
      }}>
      <Stack.Screen
        name={'AccountMain'}
        component={withContainer(AccountScreen)}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
