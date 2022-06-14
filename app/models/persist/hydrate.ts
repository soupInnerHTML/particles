import {create} from 'mobx-persist';
import asyncStorage from '@react-native-async-storage/async-storage';

export function hydrate(Model: new () => any, then = () => {}) {
  const instance = new Model();
  const name = instance._name || instance.constructor.name;
  create({
    storage: asyncStorage,
    jsonify: true, // if you use AsyncStorage, here should be true
  })(name, instance).then(() => {
    console.log(`🌊 ${name} hydrated`, instance);
    then();
  });

  function Wrapper() {
    return instance;
  }

  return Wrapper;
}
