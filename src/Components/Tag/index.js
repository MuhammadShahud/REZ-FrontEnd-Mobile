import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../Styles';

export class Tag extends Component {
  render() {
    const { isActive, text, onPress, containerStyle, textStyle, isActiveBlue } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.tagContainer,
          isActive && styles.activeBg,
          isActiveBlue && styles.activeblueBg,
          containerStyle,
        ]}>
        <Text
          style={[styles.tag, isActive && styles.activeTagColor, isActiveBlue && styles.activeTagColor ,  textStyle]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tagContainer: {
    paddingHorizontal: 15,
    //width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 7,
    marginHorizontal: 2,
    backgroundColor: Colors.GRAY_4,
  },
  tag: {
    color: Colors.GRAY_1,
  },
  activeBg: {
    backgroundColor: Colors.GREEN,
  },
  activeblueBg : {
    backgroundColor:Colors.BLUE,
  },
  activeTagColor: {
    color: Colors.WHITE,
  },
});
export default Tag;
