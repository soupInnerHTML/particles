import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {IUserModel} from '../models/mobx/AccountModel';

export const ONLINE_TIMING = 60;

export default function (userId?: string) {
  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (userId) {
      const ref = firestore().collection<IUserModel>('users').doc(userId);

      const update = () =>
        ref.update({lastSeen: firestore.FieldValue.serverTimestamp()});

      update();

      intervalId = setInterval(update, ONLINE_TIMING * 1000);
    }

    () => clearInterval(intervalId);
  }, [userId]);
}
