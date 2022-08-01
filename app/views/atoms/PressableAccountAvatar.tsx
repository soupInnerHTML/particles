import {TouchableOpacity} from 'react-native';
import {Avatar} from '@ui-kitten/components';
import React from 'react';
import useAppNavigation from '../../hooks/useAppNavigation';

interface IPressableAccountAvatarImageProps {
  image: string;
}

const PressableAccountAvatar: React.FC<IPressableAccountAvatarImageProps> = ({
  image,
}) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Account', {screen: 'Profile'})}>
      <Avatar
        source={{
          uri: image,
        }}
      />
    </TouchableOpacity>
  );
};

export default PressableAccountAvatar;
