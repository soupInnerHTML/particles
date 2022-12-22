import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignUpForm from '../../views/screens/Auth/SignUpFormScreen';
import SignInForm from '../../views/screens/Auth/SignInFormScreen';
import {LoginStackParamList} from '../navigation';
import ResetPasswordScreen from '../../views/screens/Auth/ResetPasswordScreen';
import TopNavigationHeader from '../header/TopNavigationHeader';
import commonStackStyles from '../style/commonStackStyles';
import {useStyleSheet} from '@ui-kitten/components';

const Stack = createNativeStackNavigator<LoginStackParamList>();

const LoginStack: React.FC = () => {
  const themed = useStyleSheet(commonStackStyles);
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        contentStyle: themed.stack,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
        header: ({route, back}) => (
          <TopNavigationHeader
            title={'Login'}
            subtitle={route.name}
            canGoBack={back?.title}
          />
        ),
      }}>
      <Stack.Screen name="SignUp" component={SignUpForm} />
      <Stack.Screen name="SignIn" component={SignInForm} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default LoginStack;
