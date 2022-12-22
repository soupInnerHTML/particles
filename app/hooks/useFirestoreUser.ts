import {useEffect, useState} from 'react';
import {IUserModel, IUserModelServer} from '@models/mobx/AccountModel';
import firestore from '@react-native-firebase/firestore';
import {generateAvatarPlaceholder} from '@utils/index';

export default function (userId?: string) {
  const [user, setUser] = useState<IUserModel>();
  useEffect(() => {
    if (userId) {
      return firestore()
        .collection<IUserModelServer>('users')
        .doc(userId)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const {color, ...data} = snapshot.data()!;
            setUser({
              ...data,
              avatarPlaceholder: generateAvatarPlaceholder(data.name, color),
              id: userId,
            });
          }
        });
    }
  }, [userId]);

  return user;
}
