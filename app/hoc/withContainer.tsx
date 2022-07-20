import React, {FC} from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface IContainer<
  T extends typeof ScrollView | typeof View = typeof ScrollView,
> {
  Component: T;
  props?: React.ComponentProps<T>;
}

function withContainer<
  ContainerType extends typeof ScrollView | typeof View = typeof ScrollView,
>(Component: FC<any>, container?: IContainer<ContainerType>) {
  return (props: any) => {
    const ContainerComponent = container?.Component ?? ScrollView;
    return (
      <ContainerComponent
        style={styles.container}
        bounces={false}
        {...container?.props}>
        <Component {...props} />
      </ContainerComponent>
    );
  };
}

const styles = ScaledSheet.create({
  container: {
    // marginHorizontal: '16@s',
    // position: 'relative',
    // flex: 1,
  },
});

export default withContainer;
