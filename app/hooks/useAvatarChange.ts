import {Asset, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AccountModel from '@models/mobx/AccountModel';
import {useEffect, useState} from 'react';
import {showError} from '@utils/messages';

export function useAvatarChange() {
  const [avatar, setAvatar] = useState<Asset | null>(null);

  useEffect(() => {
    if (avatar) {
      try {
        const ref = storage().ref(`/${AccountModel.id}/${avatar.fileName}`);
        const task = ref.putFile(avatar.uri!);
        task.then(async () => {
          const url = await ref.getDownloadURL();
          AccountModel.updateData({
            avatar: url,
          });
        });
      } catch (e) {
        setAvatar(null);
        showError({message: JSON.stringify(e)});
      }
    }
  }, [avatar]);
  async function changeAvatar() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.assets) {
      setAvatar(result.assets[0]);
    }
  }

  return {changeAvatar, avatar};
}
