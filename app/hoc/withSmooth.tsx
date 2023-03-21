import React from 'react';
import SmoothView from '@atoms/SmoothView';
import {Text} from '@ui-kitten/components';

export function withSmooth(Component: React.FC<any> | typeof Text) {
  return (props: any) => (
    <SmoothView>
      <Component {...props} />
    </SmoothView>
  );
}
