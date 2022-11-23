import React from 'react';
import {Button, Layout} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';
import AuthModel from '../../../models/mobx/AuthModel';

const AccountSettingsScreen: React.FC = () => {
  return (
    <Layout style={{flex: 1}}>
      <Button status={'danger'} onPress={AuthModel.signOut}>
        Sign out
      </Button>
    </Layout>
  );
};

export default observer(AccountSettingsScreen);
