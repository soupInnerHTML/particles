import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {StackItem} from '../../../navigation/navigation';
import {Layout, Text} from "@ui-kitten/components";
import {Image} from "react-native";
import useFirestoreUser from "@hooks/useFirestoreUser";

const AccountScreen: React.FC<StackItem<'Profile'>> = ({route}) => {
  const user = useFirestoreUser(route.params.id)
  return <Layout style={{flex: 1}}>
    <Image source={user?.avatar || user?.avatarPlaceholder} />
    <Text >{user?.name}</Text>
  </Layout>;
};

export default observer(AccountScreen);
