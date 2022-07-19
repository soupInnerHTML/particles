import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import withContainer from '../../hoc/withContainer';
import AccountScreen from '../../views/screens/AccountScreen';

const Stack = createNativeStackNavigator();

const AccountStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountMain"
      screenOptions={{
        contentStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name={'AccountMain'}
        component={withContainer(AccountScreen)}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
