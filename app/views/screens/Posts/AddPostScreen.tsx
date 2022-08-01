import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import PostsModel from '../../../models/PostsModel';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import commonStyles from '../../styles/commonStyles';

const AddPostScreen: React.FC = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePickerResponse>();
  async function selectImage() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 999,
    });
    setImages(result);
  }
  useEffect(() => {
    console.log(images);
  }, [images]);
  return (
    <View>
      <Input onChange={e => setText(e.nativeEvent.text)} />
      <Button onPress={() => PostsModel.add({text, images})}>Add post</Button>
      <Button style={commonStyles.mt8} onPress={selectImage}>
        Select image
      </Button>
    </View>
  );
};

export default AddPostScreen;
