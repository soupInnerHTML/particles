import React, {useMemo} from 'react';
import {IPostModel} from '../../models/PostModel';
import {
  FlatList,
  Image,
  ListRenderItem,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostsModel from '../../models/PostsModel';
import AccountModel from '../../models/AccountModel';
import {Divider, Icon, Text} from '@ui-kitten/components';
import Row from './Row';
import PressableAccountAvatar from './PressableAccountAvatar';
import commonStyles from '../styles/commonStyles';
import CommonStyles from '../styles/commonStyles';
import usersModel from '../../models/UsersModel';
import UsersModel from '../../models/UsersModel';
import {observer} from 'mobx-react-lite';
import generateAvatarPlaceholder from '../../utils/generateAvatarPlaceholder';

dayjs.extend(relativeTime);

const renderImages: (width: number) => ListRenderItem<string> =
  width =>
  ({item: image}) =>
    (
      <Image
        key={image}
        style={{width, height: 500}}
        source={{
          uri: image,
        }}
      />
    );

const Post: React.FC<IPostModel & {last: boolean}> = ({
  text,
  date,
  likes,
  id,
  author,
  images,
  last,
}) => {
  const isLiked = likes.includes(AccountModel.id!);
  const comments = Math.round(Math.random() * 10);
  const authorUser = useMemo(() => {
    return usersModel.getUser(author);
  }, [UsersModel.data]);

  const {width} = useWindowDimensions();

  return (
    <View style={commonStyles.mv8}>
      <View style={[commonStyles.mh16]}>
        <Row>
          <PressableAccountAvatar
            image={
              authorUser?.avatar ||
              generateAvatarPlaceholder(authorUser?.name, '000')
            }
          />
          <View style={commonStyles.ml8}>
            <Text>{authorUser?.name}</Text>
            <Text>{dayjs(date).fromNow()}</Text>
          </View>
        </Row>
        <Text>{text}</Text>
      </View>
      {images && (
        <FlatList
          bounces={false}
          data={images}
          disableIntervalMomentum
          snapToInterval={width}
          horizontal
          renderItem={renderImages(width)}
        />
      )}
      <View style={[commonStyles.mh16, commonStyles.mv8]}>
        <Row>
          <TouchableOpacity
            onPress={() => PostsModel.toggleLikeOnPost(id, AccountModel.id!)}>
            <Row alignItems={'center'}>
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                fill={isLiked ? 'red' : '#000'}
                width={24}
                height={24}
              />
              <Text>&nbsp;{likes?.length || ''}</Text>
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={CommonStyles.ml16}>
            <Row alignItems={'center'}>
              <Icon
                name={'message-circle-outline'}
                fill={'#000'}
                width={24}
                height={24}
              />
              <Text>&nbsp;{comments || ''}</Text>
            </Row>
          </TouchableOpacity>
        </Row>
      </View>
      {!last && <Divider style={{height: 16}} />}
    </View>
  );
};

export default observer(Post);
