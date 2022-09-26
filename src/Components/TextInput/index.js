import React from 'react';
import {View, TextInput, Image, StyleSheet} from 'react-native';
import {Text} from '..';
import {Colors} from '../../Styles';

const CustomTextInput = props => {
  const {
    multiline,
    style,
    editable,
    endIcon,
    inputContainerStyle,
    numberOfLines,
    placeholderTextColor,
    secureTextEntry,
    onChangeText,
    value,
    autoCapitalize,
    keyboardType,
    defaultValue,
  } = props;
  return (
    <View style={[styles.container, inputContainerStyle]}>
      <TextInput
        defaultValue={defaultValue}
        multiline={multiline}
        editable={editable}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : Colors.GRAY_1
        }
        style={[styles.textInputText, style]}
        onChangeText={text => (onChangeText ? onChangeText(text) : undefined)}
        autoCapitalize={autoCapitalize}
        placeholder={props.placeholder}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        value={value}
        keyboardType={keyboardType}
      />
      {endIcon && (
        <Image
          source={endIcon}
          style={{width: 25, height: 25, marginRight: 10}}
          resizeMode={'contain'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_4,
    alignItems: 'center',
    borderRadius: 12,
  },
  textInputText: {
    flex: 1,
    padding: 14,
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default CustomTextInput;
