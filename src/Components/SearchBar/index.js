import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../Styles';
import {eyeIcon, filterIcon, searchIcon} from '../../Assets';

export class SearchBar extends Component {
  render() {
    const {value, onChangeText, onSubmitEditing} = this.props;
    return (
      <View style={styles.searchContainer}>
        <View>
          <Image
            source={searchIcon}
            style={styles.searchIcon}
            resizeMode={'contain'}
          />
        </View>
        <TextInput
          placeholder={'Search here'}
          value={value}
          onChangeText={onChangeText ? text => onChangeText(text) : undefined}
          onSubmitEditing={onSubmitEditing}
          style={{flex: 1}}
        />
        {this.props.filter ? (
          <TouchableOpacity style={styles.searchFieldContainer}>
            <Image
              source={filterIcon}
              style={styles.searchIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.GRAY_1,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_4,
    alignItems: 'center',
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchIcon: {
    height: 15,
    width: 15,
  },
  searchFieldContainer: {
    position: 'absolute',
    right: 20,
  },
});
export default SearchBar;
