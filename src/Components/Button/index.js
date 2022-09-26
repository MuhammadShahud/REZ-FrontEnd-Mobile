import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../Styles';
import * as Animatable from 'react-native-animatable';

const Button = props => {
  return (
    <TouchableOpacity
      style={props.btnStyle}
      disabled={props.disabled}
      onPress={props.onPress}>
      <Animatable.View
        useNativeDriver
        duration={1000}
        // animation={props.animation || 'slideInRight'}
        style={[
          style.container,

          props.width ? {width: props.width} : {width: '100%'},
          props.backgroundColor
            ? {backgroundColor: props.backgroundColor}
            : {backgroundColor: Colors.GREEN},
          props.height ? {height: props.height} : {height: 50},
          props.btnStyle,
        ]}>
        <Text style={[style.textStyle, props.textStyle]}>{props.name}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    height: 55,
    width: '100%',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.GREEN,
  },
  textStyle: {
    fontSize: 16,
    color: Colors.GRAY_1,
    fontWeight: 'bold',
    // textTransform: 'uppercase'
  },
});

export default Button;
