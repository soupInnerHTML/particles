import React, {FC} from 'react';
import AuthForm from '../templates/AuthForm';
import {View} from 'react-native';
import AccountModel from '../../models/AccountModel';
import {StackItem} from '../../navigation/navigation';
import * as yup from 'yup';
import {ref} from 'yup/es';

const schema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required().min(6),
  repeatPassword: yup
    .string()
    .required()
    .min(6)
    .equals(
      [ref('password')],
      'The password and repeat password fields do not match.',
    ),
});

const MyComponent: FC<StackItem<'SignUp'>> = () => {
  return (
    <View style={{flex: 1}}>
      <AuthForm
        schema={schema}
        fields={[
          {name: 'email', placeholder: 'Email', type: 'email-address'},
          {name: 'name', placeholder: 'Name'},
          {name: 'password', placeholder: 'Password', secure: true},
          {
            name: 'repeatPassword',
            placeholder: 'Repeat password',
            secure: true,
          },
        ]}
        button={{
          title: 'Sign up',
          type: 'success',
        }}
        link={{
          labelText: 'Already have an account?',
          text: 'Sign in',
          linkTo: 'SignIn',
        }}
        onSubmit={AccountModel.signUp}
      />
    </View>
  );
};

export default MyComponent;
