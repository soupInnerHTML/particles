import FirestoreModel from './abstract/FirestoreModel';
import {IPostModel, IPostModelWithoutId} from './PostModel';
import {makeObservable, override} from 'mobx';
import {Alert} from 'react-native';
import {hydrate} from './persist/hydrate';
import AccountModel from './AccountModel';

@hydrate
class PostsModel extends FirestoreModel<IPostModel> {
  @override
  async add(item: IPostModelWithoutId): Promise<void> {
    if (item.text?.length) {
      await super.add({
        ...item,
        likes: <string[]>[],
        author: AccountModel.id!,
        date: Date.now(),
      });
    } else {
      Alert.alert('Add text');
    }
  }

  toggleLikeOnPost = async (postId: string, accountId: string) => {
    const instance = this._instance.doc(postId);
    const targetPost = await instance.get();
    const targetPostData = targetPost.data()!;
    const isLiked = targetPostData.likes.includes(accountId);

    if (isLiked) {
      await instance.update({
        likes: targetPostData.likes.filter(like => like !== accountId),
      });
    } else {
      await instance.update({
        likes: [...targetPostData.likes, accountId],
      });
    }
  };

  constructor() {
    super();
    makeObservable(this);
  }
}

export default new PostsModel();
