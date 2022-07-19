import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInputAndroidProps,
  TextInputIOSProps,
  TouchableOpacity,
  View,
} from 'react-native';
import AccountModel, {IAuth} from '../../models/AccountModel';
import {observer} from 'mobx-react-lite';
import {ScaledSheet} from 'react-native-size-matters';
import {Button, Text, useTheme} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';
import LoadingIndicator from '../atoms/LoadingIndicator';
import Row from '../atoms/Row';
import useAppNavigation from '../../hooks/useAppNavigation';
import GoogleIcon from '../../assets/svg/google.svg';
import renderIf from '../../utils/renderIf';
import {FormProvider, useForm} from 'react-hook-form';
import ControlledInput from '../organisms/ControlledInput';
import {yupResolver} from '@hookform/resolvers/yup';

interface IAuthFormProps {
  fields: {
    name: string;
    placeholder: string;
    type?: KeyboardTypeOptions;
    secure?: boolean;
    textContentType?: TextInputIOSProps['textContentType'];
    autoComplete?: TextInputAndroidProps['autoComplete'];
  }[];
  button: {
    title: string;
    type?: EvaStatus;
  };
  link: {
    text: string;
    labelText: string;
    linkTo: 'SignIn' | 'SignUp';
  };
  onSubmit: (params: IAuth) => void;
  schema: any;
}

const AuthForm: React.FC<IAuthFormProps> = ({
  fields,
  button,
  onSubmit,
  link,
  schema,
}) => {
  const navigation = useAppNavigation();
  const methods = useForm<IAuth>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      {fields.map(field => (
        <ControlledInput
          autoComplete={field.autoComplete}
          textContentType={field.textContentType}
          name={field.name}
          control={methods.control}
          secureTextEntry={field.secure}
          size={'large'}
          key={field.name}
          placeholder={field.placeholder}
          keyboardType={field.type}
          style={styles.input}
        />
      ))}
      <View style={styles.submit}>
        <Row style={styles.mb8}>
          <Text category={'h6'}>{link.labelText}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login', {screen: link.linkTo})}>
            <Text category={'h6'} status={'primary'}>
              &nbsp;{link.text}
            </Text>
          </TouchableOpacity>
        </Row>

        <Button
          disabled={AccountModel.isPending}
          accessoryRight={renderIf(
            AccountModel.isGoogleSignIn,
            <LoadingIndicator />,
          )}
          onPress={AccountModel.googleSignIn}
          status={'basic'}
          style={styles.mb8}
          accessoryLeft={() => <GoogleIcon width={23} height={23} />}>
          Google sign in
        </Button>

        <Button
          status={button.type}
          accessoryRight={renderIf(
            AccountModel.isSimpleSignIn,
            <LoadingIndicator />,
          )}
          disabled={AccountModel.isPending}
          onPress={methods.handleSubmit(() => onSubmit(methods.getValues()))}>
          {button.title}
        </Button>
      </View>
    </FormProvider>
  );
};

const styles = ScaledSheet.create({
  submit: {
    position: 'absolute',
    bottom: '32@vs',
    right: 0,
    left: 0,
  },
  input: {
    marginTop: '20@vs',
  },
  mb8: {
    marginBottom: '8@vs',
  },
});

export default observer(AuthForm);
