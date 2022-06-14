import React from 'react';
import {IPostModel, IPostModelWithoutId} from '../../models/PostModel';
import {Text, TouchableOpacity, View} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {ScaledSheet} from 'react-native-size-matters';
import PostsModel from '../../models/PostsModel';
import AccountModel from '../../models/AccountModel';

dayjs.extend(relativeTime);

const Post: React.FC<IPostModel> = ({text, date, likes, id}) => {
  return (
    <View style={styles.post}>
      <Text>{text}</Text>
      <Text>{dayjs(date).fromNow()}</Text>
      <TouchableOpacity
        onPress={() => PostsModel.toggleLikeOnPost(id, AccountModel.id)}>
        <Text>❤️ {likes?.length}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  post: {
    margin: '8@vs',
  },
});

export default Post;
