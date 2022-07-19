import React from 'react';
import AccountModel from '../../models/AccountModel';
import {observer} from 'mobx-react-lite';
import {Button} from '@ui-kitten/components';

const AccountScreen: React.FC = () => {
  return (
    <>
      <Button status={'danger'} onPress={AccountModel.signOut}>
        Sign out
      </Button>
    </>
  );
};

export default observer(AccountScreen);
