import React from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';

const AddPostScreen: React.FC = () => {
  return (
    <View>
      <Input />
      <Button>Add post</Button>
    </View>
  );
};

export default AddPostScreen;
