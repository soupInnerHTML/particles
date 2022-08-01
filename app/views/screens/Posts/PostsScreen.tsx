import React, {useEffect} from 'react';
import {FlatList, ListRenderItem, ScrollView} from 'react-native';
import {observer} from 'mobx-react-lite';
import PostsModel from '../../../models/PostsModel';
import Post from '../../atoms/Post';
import PostModel from '../../../models/PostModel';
import UsersModel from '../../../models/UsersModel';
import {toJS} from 'mobx';

const keyExtractor = (item: PostModel) => item.id;
const renderItem: ListRenderItem<PostModel> = ({item}) => <Post {...item} />;
const getItem = (data: any, index: number) => data[index];
const getItemCount = (data: any) => data.length;

const PostsScreen: React.FC = () => {
  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      {/*<FlatList*/}
      {/*  refreshing={PostsModel.isPending}*/}
      {/*  data={PostsModel.data}*/}
      {/*  onRefresh={PostsModel.getData}*/}
      {/*  getItemLayout={(data, index) => ({*/}
      {/*    length: data.length,*/}
      {/*    index,*/}
      {/*    offset: data.length * 50,*/}
      {/*  })}*/}
      {/*  {...{keyExtractor, getItem, getItemCount, renderItem}}*/}
      {/*/>*/}
      {PostsModel.data.map((post, index) => (
        <Post
          key={post.id}
          last={index === PostsModel.data.length - 1}
          {...post}
        />
      ))}
    </ScrollView>
  );
};

export default observer(PostsScreen);
