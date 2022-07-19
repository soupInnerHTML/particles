import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignUpForm from '../../views/screens/SignUpFormScreen';
import SignInForm from '../../views/screens/SignInFormScreen';
import {LoginStackParamList} from '../navigation';
import withContainer from '../../hoc/withContainer';
import {View} from 'react-native';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import normalizeText from '../../utils/normalizeText';
import useAppNavigation from '../../hooks/useAppNavigation';

const Stack = createNativeStackNavigator<LoginStackParamList>();

const BackAction = () => {
  const navigation = useAppNavigation();
  return (
    <TopNavigationAction
      onPress={navigation.goBack}
      icon={<Icon name="arrow-back" />}
    />
  );
};

const LoginStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        contentStyle: {backgroundColor: '#fff'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        header: ({route, back}) => (
          <TopNavigation
            accessoryLeft={() => (back ? <BackAction /> : <></>)}
            title={'Login'}
            subtitle={normalizeText(route.name)}
            alignment={'center'}
          />
        ),
      }}>
      <Stack.Screen
        name="SignUp"
        component={withContainer(SignUpForm, {Component: View})}
      />
      <Stack.Screen
        name="SignIn"
        component={withContainer(SignInForm, {Component: View})}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;
