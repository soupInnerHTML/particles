import React from 'react';
import {View} from 'react-native';
import {Button} from '@ui-kitten/components';
import {observer} from 'mobx-react-lite';
import AuthModel from '../../../models/AuthModel';

const AccountSettingsScreen: React.FC = () => {
  return (
    <View>
      <Button status={'danger'} onPress={AuthModel.signOut}>
        Sign out
      </Button>
    </View>
  );
};

export default observer(AccountSettingsScreen);
