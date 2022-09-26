import React from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
export default function Loader({loader}) {
  return (
    <Spinner
      visible={loader}
      textContent={'Loading...'}
      textStyle={styles.spinnerTextStyle}
    />
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {color: '#FFF', fontSize: 16},
});
