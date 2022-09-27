import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import PostsModel from '../../../models/PostsModel';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import commonStyles from '../../styles/commonStyles';

const IMAGE_LIMIT = 999;
const VIDEO_LIMIT = 999;

const AddPostScreen: React.FC = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePickerResponse>();
  const [videos, setVideos] = useState<ImagePickerResponse>();
  async function selectImage() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: IMAGE_LIMIT,
    });
    setImages(result);
  }
  async function selectVideo() {
    const result = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: VIDEO_LIMIT,
    });
    setVideos(result);
  }
  useEffect(() => {
    console.log(images);
  }, [images]);
  return (
    <View>
      <Input onChange={e => setText(e.nativeEvent.text)} />
      <Button onPress={() => PostsModel.add({text, images, videos})}>
        Add post
      </Button>
      <Button style={commonStyles.mt8} onPress={selectImage}>
        Select image
      </Button>
      <Button style={commonStyles.mt8} onPress={selectVideo}>
        Select video
      </Button>
    </View>
  );
};

export default AddPostScreen;
