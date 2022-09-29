import React from 'react';
import {View} from 'react-native';
import {Text} from '@ui-kitten/components';
import {ScaledSheet} from 'react-native-size-matters';

interface IChipsCounterProps {
  count: Maybe<number>;
}

const ChipsCounter: React.FC<IChipsCounterProps> = ({count}) => {
  return count ? (
    <View style={styles.counter}>
      <Text style={styles.counterText}>{count}</Text>
    </View>
  ) : (
    <></>
  );
};

const styles = ScaledSheet.create({
  counter: {
    backgroundColor: '#0292f9',
    paddingHorizontal: '8@s',
    paddingVertical: '4@vs',
    borderRadius: '16@s',
    alignSelf: 'flex-end',
    marginTop: '4@vs',
  },
  counterText: {
    color: '#fff',
  },
});

export default ChipsCounter;
