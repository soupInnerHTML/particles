import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import AuthForm from '../../templates/AuthForm';
import AccountModel from '../../../models/AccountModel';
import {StackItem} from '../../../navigation/navigation';
import * as yup from 'yup';
import AuthModel from '../../../models/AuthModel';

export const defaultSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const SignInFormScreen: FC<StackItem<'SignIn'>> = () => {
  return (
    <AuthForm
      resetPassword
      schema={defaultSchema}
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
      onSubmit={AuthModel.signIn}
      link={{
        labelText: "Don't have an account?",
        text: 'Sign up',
        linkTo: 'SignUp',
      }}
    />
  );
};

export default observer(SignInFormScreen);
