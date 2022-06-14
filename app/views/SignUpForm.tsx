import React from 'react';
import AuthForm from './library/AuthForm';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Text, TouchableOpacity, View} from 'react-native';
import AccountModel from '../models/AccountModel';

const MyComponent: NavigationFunctionComponent = props => {
  return (
    <View style={{flex: 1}}>
      <AuthForm
        componentId={props.componentId}
        fields={['email', 'name', 'password', 'repeatPassword']}
        buttonTitle={'Sign up'}
        onSubmit={AccountModel.signUp}
      />
      <Text>Already have an account?</Text>
      <TouchableOpacity
        onPress={() => {
          Navigation.pop(props.componentId);
        }}>
        <Text style={{color: 'blue'}}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyComponent;
