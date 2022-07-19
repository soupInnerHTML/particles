import React from 'react';
import {View} from 'react-native';

export default function <T>(
  condition: any,
  render: T,
  mode?: 'hide' | 'remove',
) {
  switch (mode) {
    case 'hide':
      return (
        <View style={{display: condition ? 'flex' : 'none'}}>{render}</View>
      );
    case 'remove':
    default:
      return condition ? render : <></>;
  }
}
