import React, {useEffect} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {observer} from 'mobx-react-lite';
import AuthForm from './library/AuthForm';
import {Text, TouchableOpacity, View} from 'react-native';
import {NavigationComponents} from '../navigation';
import AccountModel from '../models/AccountModel';
import SplashScreen from 'react-native-lottie-splash-screen';

const SignInForm: NavigationFunctionComponent = props => {
  useEffect(() => {
    setInterval(() => {
      const rand = Math.round(Math.random());
      rand ? SplashScreen.show() : SplashScreen.show(); // here
      console.log(rand);
    }, 2000);
  }, []);
  return (
    <View style={{flex: 1}}>
      <AuthForm
        componentId={props.componentId}
        fields={['email', 'password']}
        buttonTitle={'Sign in'}
        onSubmit={AccountModel.signIn}
      />
      <Text>Don't have an account?</Text>
      <TouchableOpacity
        onPress={() => {
          Navigation.push(props.componentId, {
            component: {name: NavigationComponents.SIGN_UP_FORM},
          });
        }}>
        <Text style={{color: 'blue'}}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default observer(SignInForm);
