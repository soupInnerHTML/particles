import React, {useEffect} from 'react';
import {Button, Icon, Layout} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';
import AuthModel from '../../../models/mobx/AuthModel';
import AccountModel from '@models/mobx/AccountModel';
import CustomSwitch from '@atoms/CustomSwitch';
import {noop} from 'lodash';
import commonStyles from '../../styles/commonStyles';
import {FormProvider, useForm} from 'react-hook-form';
import ControlledInput from '@organisms/ControlledInput';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {StackItem} from '../../../navigation/navigation';

const createObject = (arr: any[], key1: string, key2: string) => {
  return Object.fromEntries(arr.map(item => [item[key1], item[key2]]));
};

const AccountSettingsScreen: React.FC<StackItem<'Settings'>> = ({
  navigation,
  route,
}) => {
  const schema = [
    {
      name: 'name',
      placeholder: 'Name',
      value: AccountModel.name,
      rule: yup.string().required(),
    },
    {
      name: 'shortName',
      placeholder: 'Nickname',
      value: AccountModel.shortName,
      rule: yup
        .string()
        .required()
        .matches(/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/g, {
          message: 'Not valid nickname, example: @ruby_soho',
          name: 'asas',
        }),
    },
    {
      name: 'bio',
      placeholder: 'BIO',
      value: AccountModel.bio,
      rule: yup.string().max(60),
    },
  ];

  const form = useForm({
    mode: 'onTouched',
    defaultValues: createObject(schema, 'name', 'value'),
    resolver: yupResolver(createObject(schema, 'name', 'rule')),
  });
  useEffect(() => {
    form.handleSubmit(AccountModel.checkShortName(AccountModel.updateData))();
  }, [route.params?.save]);
  return (
    <Layout style={{flex: 1}}>
      <FormProvider {...form}>
        {schema.map(input => (
          <ControlledInput
            key={input.name}
            accessoryLeft={props => <Icon name={'person'} {...props} />}
            style={commonStyles.mv8}
            placeholder={input.placeholder}
            name={input.name}
            onChangeText={name => navigation.setParams({[input.name]: name})}
            cleanable={false}
            autoCapitalize={'words'}
          />
        ))}
      </FormProvider>

      <CustomSwitch
        text={'Dark theme'}
        onChange={value => AccountModel.setTheme(value ? 'dark' : 'light')}
        checked={AccountModel.theme === 'dark'}
      />
      <CustomSwitch text={'Mute all chats'} onChange={noop} checked={false} />
      <Button
        status={'danger'}
        onPress={AuthModel.signOut}
        style={commonStyles.mt16}>
        Sign out
      </Button>
    </Layout>
  );
};

export default observer(AccountSettingsScreen);
