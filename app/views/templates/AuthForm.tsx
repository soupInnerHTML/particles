import React from 'react';
import {
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  TextInputAndroidProps,
  TextInputIOSProps,
  TouchableOpacity,
  View,
} from 'react-native';
import AccountModel, {IAuth} from '../../models/AccountModel';
import {observer} from 'mobx-react-lite';
import {ScaledSheet} from 'react-native-size-matters';
import {Button, Text} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';
import LoadingIndicator from '../atoms/LoadingIndicator';
import Row from '../atoms/Row';
import useAppNavigation from '../../hooks/useAppNavigation';
import GoogleIcon from '../../assets/svg/google.svg';
import renderIf from '../../utils/renderIf';
import {FormProvider, useForm} from 'react-hook-form';
import ControlledInput from '../organisms/ControlledInput';
import {yupResolver} from '@hookform/resolvers/yup';
import {useHeaderHeight} from '@react-navigation/elements';

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
  link?: {
    text: string;
    labelText: string;
    linkTo: 'SignIn' | 'SignUp';
  };
  onSubmit: (params: IAuth) => void;
  schema: any;
  resetPassword?: boolean;
}

const AuthForm: React.FC<IAuthFormProps> = ({
  fields,
  button,
  onSubmit,
  link,
  schema,
  resetPassword,
}) => {
  const navigation = useAppNavigation();
  const methods = useForm<IAuth>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={'padding'}
      keyboardVerticalOffset={headerHeight}>
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
          {renderIf(link, () => (
            <Row>
              <Text category={'h6'}>{link!.labelText}</Text>
              <TouchableOpacity
                style={!resetPassword && styles.mb8}
                onPress={() =>
                  navigation.navigate('Login', {screen: link!.linkTo})
                }>
                <Text category={'h6'} status={'primary'}>
                  &nbsp;{link!.text}
                </Text>
              </TouchableOpacity>
            </Row>
          ))}
          {renderIf(resetPassword, () => (
            <TouchableOpacity
              style={styles.mb8}
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text category={'h6'} appearance={'hint'}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          ))}

          <Button
            disabled={AccountModel.isPending}
            accessoryRight={renderIf(AccountModel.isGoogleSignIn, () => (
              <LoadingIndicator />
            ))}
            onPress={AccountModel.googleSignIn}
            status={'basic'}
            style={styles.mb8}
            accessoryLeft={() => <GoogleIcon width={23} height={23} />}>
            Google sign in
          </Button>

          {/*<Button*/}
          {/*  disabled={AccountModel.isPending}*/}
          {/*  accessoryRight={renderIf(AccountModel.isGoogleSignIn, () => (*/}
          {/*    <LoadingIndicator />*/}
          {/*  ))}*/}
          {/*  onPress={AccountModel.githubSignIn}*/}
          {/*  status={'basic'}*/}
          {/*  style={styles.mb8}*/}
          {/*  // accessoryLeft={() => <GoogleIcon width={23} height={23} />}*/}
          {/*>*/}
          {/*  Github sign in*/}
          {/*</Button>*/}

          <Button
            status={button.type}
            accessoryRight={renderIf(AccountModel.isSimpleSignIn, () => (
              <LoadingIndicator />
            ))}
            disabled={AccountModel.isPending}
            onPress={methods.handleSubmit(() => onSubmit(methods.getValues()))}>
            {button.title}
          </Button>
        </View>
      </FormProvider>
    </KeyboardAvoidingView>
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
