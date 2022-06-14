import React, {useState} from 'react';
import {Button, FlatList, ListRenderItem, TextInput} from 'react-native';
import {observer} from 'mobx-react-lite';
import PostsModel from '../models/PostsModel';
import Post from './library/Post';
import PostModel from '../models/PostModel';
import AccountModel from '../models/AccountModel';

const keyExtractor = (item: PostModel) => item.id;
const renderItem: ListRenderItem<PostModel> = ({item}) => <Post {...item} />;
const getItem = (data: any, index: number) => data[index];
const getItemCount = (data: any) => data.length;

const Posts: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <>
      <Button title={'Sign out'} onPress={AccountModel.signOut} />
      <TextInput onChange={e => setText(e.nativeEvent.text)} />
      <Button title={'post'} onPress={() => PostsModel.add({text})} />
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
      {PostsModel.data.map(post => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
};

export default observer(Posts);
