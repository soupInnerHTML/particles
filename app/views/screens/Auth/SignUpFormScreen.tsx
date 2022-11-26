import React, {FC} from 'react';
import AuthForm from '../../templates/AuthForm';
import {View} from 'react-native';
import {StackItem} from '../../../navigation/navigation';
import * as yup from 'yup';
import {ref} from 'yup/es';
import {defaultSchema} from './SignInFormScreen';
import AuthModel from '../../../models/mobx/AuthModel';

const schema = yup.object({
  name: yup.string().required(),
  shortName: yup
    .string()
    .required()
    .matches(/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/g, {
      message: 'Not valid nickname, example: @ruby_soho',
      name: 'asas',
    }),
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
        schema={defaultSchema.concat(schema)}
        fields={[
          {name: 'email', placeholder: 'Email', type: 'email-address'},
          {name: 'name', placeholder: 'Name'},
          {name: 'shortName', placeholder: 'Nickname'},
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
        onSubmit={AuthModel.signUp}
      />
    </View>
  );
};

export default MyComponent;
