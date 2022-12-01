import React from 'react';
import {Button, Input, Layout} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';
import AuthModel from '../../../models/mobx/AuthModel';
import AccountModel from '@models/mobx/AccountModel';
import CustomSwitch from '@atoms/CustomSwitch';
import {noop} from 'lodash';
import commonStyles from '../../styles/commonStyles';

const AccountSettingsScreen: React.FC = () => {
  return (
    <Layout style={{flex: 1}}>
      <Input
        value={AccountModel.email}
        style={commonStyles.mv8}
        placeholder={'Email'}
      />
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
