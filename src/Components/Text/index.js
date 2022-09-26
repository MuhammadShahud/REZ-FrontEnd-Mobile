import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Colors, Typography} from '../../Styles';

const CText = ({style, children, ...rest}) => {
  return (
    <Text {...rest} style={[styles.textStyle, style]}>
      {children}
    </Text>
  );
};

export default CText;

const styles = StyleSheet.create({
  textStyle: {},
});
