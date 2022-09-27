import FirestoreModel from './abstract/FirestoreModel';
import {IPostModel, IPostModelWithoutId} from './PostModel';
import {makeObservable, override} from 'mobx';
import {hydrate} from './persist/hydrate';
import AccountModel from './AccountModel';
import {showWarning} from '../utils/messages';
import storage from '@react-native-firebase/storage';
import {ImagePickerResponse} from 'react-native-image-picker';
import {v4 as uuidv4} from 'uuid';

@hydrate
class PostsModel extends FirestoreModel<IPostModel> {
  @override
  async add(
    item: Omit<IPostModelWithoutId, 'images'> & {images?: ImagePickerResponse},
  ): Promise<void> {
    const images: string[] = [];
    const videos: string[] = [];

    if (item.images) {
      for (const asset of item.images.assets!) {
        const ref = await storage().ref(
          `/posts/${AccountModel.id}/${uuidv4()}`,
        );

        await ref.putFile(asset.uri!);

        const url = await ref.getDownloadURL();
        images.push(url);
      }
    }
    if (item.videos) {
      for (const asset of item.videos.assets!) {
        const ref = await storage().ref(
          `/posts/${AccountModel.id}/${uuidv4()}`,
        );

        await ref.putFile(asset.uri!);

        const url = await ref.getDownloadURL();
        videos.push(url);
      }
    }
    if (item.text?.length || images) {
      await super.add({
        ...item,
        likes: <string[]>[],
        author: AccountModel.id!,
        date: Date.now(),
        images,
        videos,
      });
    } else {
      showWarning({message: 'Add content'});
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
