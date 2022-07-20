import React, {FC} from 'react';
import {ResourceSavingView} from '@react-navigation/elements';
import {useIsFocused} from '@react-navigation/native';

const withResourceSaving = (Component: FC<any>) => (props: any) => {
  const isFocused = useIsFocused();
  return (
    <ResourceSavingView visible={isFocused}>
      <Component {...props} />
    </ResourceSavingView>
  );
};

export default withResourceSaving;
