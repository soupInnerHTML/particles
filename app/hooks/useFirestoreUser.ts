import {useEffect, useState} from 'react';
import {IUserModel} from '../models/mobx/AccountModel';
import firestore from '@react-native-firebase/firestore';

export default function (userId: string) {
  const [user, setUser] = useState<IUserModel>();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection<IUserModel>('users')
      .doc(userId)
      .onSnapshot(snapshot => {
        setUser(snapshot.data());
      });
    () => unsubscribe();
  }, [userId]);

  return user;
}
