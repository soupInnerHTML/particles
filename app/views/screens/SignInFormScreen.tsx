import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import AuthForm from '../templates/AuthForm';
import {View} from 'react-native';
import AccountModel from '../../models/AccountModel';
import {StackItem} from '../../navigation/navigation';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(9),
});

const SignInFormScreen: FC<StackItem<'SignIn'>> = () => {
  return (
    <View style={{flex: 1}}>
      <AuthForm
        schema={schema}
        fields={[
          {
            name: 'email',
            placeholder: 'Email',
            type: 'email-address',
            textContentType: 'username',
            autoComplete: 'email',
          },
          {
            name: 'password',
            placeholder: 'Password',
            secure: true,
            textContentType: 'newPassword',
            autoComplete: 'password',
          },
        ]}
        button={{
          title: 'Sign in',
          type: 'primary',
        }}
        onSubmit={AccountModel.signIn}
        link={{
          labelText: "Don't have an account?",
          text: 'Sign up',
          linkTo: 'SignUp',
        }}
      />
    </View>
  );
};

export default observer(SignInFormScreen);
