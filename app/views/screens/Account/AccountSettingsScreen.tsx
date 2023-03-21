import React, {useEffect, useMemo} from 'react';
import {Button, Icon, Layout, Text} from '@ui-kitten/components';
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
import {StackItem} from '../../../navigation/navigation.types';
import {Platform, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import PressableAccountAvatar from '@atoms/PressableAccountAvatar';
import {useAvatarChange} from '@hooks/useAvatarChange';

const createObject = (arr: any[], key1: string, key2: string) => {
  return Object.fromEntries(arr.map(item => [item[key1], item[key2]]));
};

const AccountSettingsScreen: React.FC<StackItem<'Settings'>> = ({
  navigation,
  route,
}) => {
  const schema = useMemo(() => {
    return [
      {
        name: 'name',
        placeholder: 'Name',
        value: AccountModel.name,
        icon: 'person',
        rule: yup.string().required(),
      },
      {
        name: 'shortName',
        placeholder: 'Nickname, example: elon_musk',
        value: AccountModel.shortName,
        icon: 'at',
        rule: yup
          .string()
          .required('Nickname is a required field')
          .matches(/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/g, {
            message: 'Not a valid nickname',
            name: 'asas',
          }),
      },
      {
        name: 'bio',
        placeholder: 'BIO, example: 20 y.o. udmurt developer',
        value: AccountModel.bio,
        icon: 'hash',
        rule: yup.string().max(60),
      },
    ];
  }, []);

  const form = useForm({
    mode: 'onTouched',
    defaultValues: createObject(schema, 'name', 'value'),
    resolver: yupResolver(yup.object(createObject(schema, 'name', 'rule'))),
  });
  console.log('render');

  useEffect(() => {
    setTimeout(() => {
      const {isDirty} = form.formState;
      if (route.params.changed !== isDirty) {
        navigation.setParams({
          changed: isDirty,
        });
      }
    });
  }, [form.formState.isDirty]);

  useEffect(() => {
    setTimeout(() => {
      const {isValid} = form.formState;
      if (isValid !== route.params.valid) {
        navigation.setParams({
          valid: isValid,
        });
      }
    });
  }, [form.formState.isValidating]);

  useEffect(() => {
    form
      .handleSubmit(AccountModel.checkShortName(AccountModel.updateData))()
      .then(() => {
        navigation.setParams({changed: false});
      });
  }, [route.params?.save]);

  const {avatar, changeAvatar} = useAvatarChange();

  return (
    <Layout style={commonStyles.full}>
      <Text style={[commonStyles.mt16, styles.accTitle]} category={'h6'}>
        Account details
      </Text>
      <View style={styles.avatarWrapper}>
        <PressableAccountAvatar
          style={styles.avatar}
          onPress={changeAvatar}
          image={
            avatar?.uri ?? AccountModel.avatar ?? AccountModel.avatarPlaceholder
          }
        />
        <TouchableOpacity onPress={changeAvatar} style={styles.editWrapper}>
          <Icon style={styles.edit} fill="#000" name="edit" />
        </TouchableOpacity>
      </View>
      <FormProvider {...form}>
        {schema.map(input => (
          <ControlledInput
            key={input.name}
            accessoryLeft={props => <Icon name={input.icon} {...props} />}
            placeholder={input.placeholder}
            name={input.name}
            cleanable={false}
            autoCapitalize={'none'}
          />
        ))}
      </FormProvider>

      <View style={[commonStyles.mv16, commonStyles.full]}>
        <Text style={commonStyles.mt16} category={'h6'}>
          Miscellaneous
        </Text>

        <CustomSwitch
          text={'Dark theme'}
          onChange={value => AccountModel.setTheme(value ? 'dark' : 'light')}
          checked={AccountModel.theme === 'dark'}
        />
        <CustomSwitch
          text={'Notifications enabled'}
          onChange={AccountModel.setNotificationsEnabled}
          checked={AccountModel.notificationsEnabled}
          disabled={Platform.OS === 'ios'}
        />

        <Button
          status={'danger'}
          onPress={AuthModel.signOut}
          style={commonStyles.mta}>
          Sign out
        </Button>
      </View>
    </Layout>
  );
};

const styles = ScaledSheet.create({
  accTitle: {
    // marginBottom: '-8@vs',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: '96@s',
    height: '96@s',
    alignSelf: 'center',
  },
  edit: {
    width: '16@s',
    height: '16@s',
  },
  editWrapper: {
    width: '20@s',
    height: '20@s',
    position: 'absolute',
    borderRadius: '20@s',
    padding: '2@s',
    bottom: '8@vs',
    left: '60%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    right: '8@s',
  },
});

export default observer(AccountSettingsScreen);
