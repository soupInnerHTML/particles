import {TouchableOpacity} from 'react-native';
import {Avatar, AvatarProps} from '@ui-kitten/components';
import React from 'react';
import useAppNavigation from '../../hooks/useAppNavigation';

interface IPressableAccountAvatarImageProps {
  image: string;
  id: string;
}

const PressableAccountAvatar: React.FC<
  IPressableAccountAvatarImageProps & Omit<AvatarProps, 'source'>
> = ({image, id, ...props}) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Account', {screen: 'Profile', params: {id}})
      }>
      <Avatar
        source={{
          uri: image,
        }}
        {...props}
      />
    </TouchableOpacity>
  );
};

export default PressableAccountAvatar;
