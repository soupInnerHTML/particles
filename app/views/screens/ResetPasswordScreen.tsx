import React from 'react';
import AuthForm from '../templates/AuthForm';
import AccountModel from '../../models/AccountModel';
import {observer} from 'mobx-react-lite';
import {defaultSchema} from './SignInFormScreen';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().required().email(),
});

const ResetPasswordScreen: React.FC = () => {
  return (
    <AuthForm
      schema={schema}
      fields={[{name: 'email', placeholder: 'Email', type: 'email-address'}]}
      button={{title: 'Reset password', type: 'danger'}}
      onSubmit={AccountModel.sendPasswordResetEmail}
    />
  );
};

export default observer(ResetPasswordScreen);
