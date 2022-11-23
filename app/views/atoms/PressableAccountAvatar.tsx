import {TouchableOpacity} from 'react-native';
import {Avatar} from '@ui-kitten/components';
import React from 'react';
import useAppNavigation from '../../hooks/useAppNavigation';
import useFirestoreUser from "@hooks/useFirestoreUser";

interface IPressableAccountAvatarImageProps {
  image: string;
  id: string;
}

const PressableAccountAvatar: React.FC<IPressableAccountAvatarImageProps> = ({
  image, id,
}) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Account', {screen: 'Profile', params: {id}})}>
      <Avatar
        source={{
          uri: image,
        }}
      />
    </TouchableOpacity>
  );
};

export default PressableAccountAvatar;
