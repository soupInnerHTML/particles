import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner} from '@ui-kitten/components';

const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.spinner}>
      <Spinner />
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
