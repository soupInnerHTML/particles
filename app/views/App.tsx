import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import UserModel from '../models/UserModel';

const MyComponent: React.FC = () => {
  useEffect(() => {
    firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        console.log(snapshot.size);
        snapshot.forEach(user => {
          if (user.exists) {
            console.log(user.data());
          }
        });
      });

    // firestore().collection('users').add({
    //   name: 'Ada Lovelace',
    //   email: 'ada@gmail.com',
    // });
  }, []);
  return <Text>hello world</Text>;
};

export default MyComponent;
