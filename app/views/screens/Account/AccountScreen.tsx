import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {StackItem} from '../../../navigation/navigation';

const AccountScreen: React.FC<StackItem<'Profile'>> = ({route}) => {
  useEffect(() => {}, []);
  return <></>;
};

export default observer(AccountScreen);
