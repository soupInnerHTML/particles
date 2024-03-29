import React from 'react';
import {
  KeyboardTypeOptions,
  TextInputAndroidProps,
  TextInputIOSProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {ScaledSheet} from 'react-native-size-matters';
import {Button, Layout, Text} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';
import LoadingIndicator from '../atoms/LoadingIndicator';
import Row from '../atoms/Row';
import useAppNavigation from '../../hooks/useAppNavigation';
import GoogleIcon from '@svg/google.svg';
import renderIf from '../../utils/renderIf';
import {FormProvider, useForm} from 'react-hook-form';
import ControlledInput from '../organisms/ControlledInput';
import {yupResolver} from '@hookform/resolvers/yup';
import AuthModel, {IAuth} from '../../models/mobx/AuthModel';
import commonStyles from '../styles/commonStyles';

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
  onSubmit: (params: IAuth) => unknown;
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

  return (
    <Layout style={{flex: 1}}>
      <FormProvider {...methods}>
        {fields.map(field => (
          <ControlledInput
            disabled={AuthModel.isPending}
            autoComplete={field.autoComplete}
            textContentType={field.textContentType}
            name={field.name}
            control={methods.control}
            secureTextEntry={field.secure}
            size={'large'}
            key={field.name}
            placeholder={field.placeholder}
            keyboardType={field.type}
          />
        ))}
        <View style={styles.submit}>
          {renderIf(link, () => (
            <Row>
              <Text category={'h6'}>{link!.labelText}</Text>
              <TouchableOpacity
                style={!resetPassword && commonStyles.mb8}
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
              style={commonStyles.mb8}
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text category={'h6'} appearance={'hint'}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          ))}

          <Button
            disabled={AuthModel.isPending}
            accessoryRight={renderIf(AuthModel.isGoogleSignIn, () => (
              <LoadingIndicator />
            ))}
            onPress={AuthModel.googleSignIn}
            status={'basic'}
            style={commonStyles.mb8}
            accessoryLeft={() => <GoogleIcon width={23} height={23} />}>
            Google sign in
          </Button>

          <Button
            status={button.type}
            accessoryRight={renderIf(AuthModel.isSimpleSignIn, () => (
              <LoadingIndicator />
            ))}
            disabled={AuthModel.isPending}
            onPress={methods.handleSubmit(onSubmit)}>
            {button.title}
          </Button>
        </View>
      </FormProvider>
    </Layout>
  );
};

const styles = ScaledSheet.create({
  submit: {
    position: 'absolute',
    bottom: '32@vs',
    right: 0,
    left: 0,
  },
});

export default observer(AuthForm);
