import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {attachmentIcon, dropdownGreyIcon} from '../../../Assets';
import {Button, Header, Text} from '../../../Components';
import {Colors} from '../../../Styles';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      registerAs: ['Parent', 'Player', 'Facility', 'Coach', 'Store', 'Team'],
    };
  }

  handleChangeEmail = value => {
    this.setState({email: value});
    console.warn(value);
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Highlights"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View style={styles.mainView}>
            <View
              style={{
                backgroundColor: Colors.GRAY_2,
                borderRadius: 20,
                padding: 10,
                flex: 0.6,
                marginVertical: 10,
              }}>
              <View
                style={{width: '100%', marginTop: 10, paddingHorizontal: 20}}>
                <SelectDropdown
                  data={this.state.registerAs}
                  //   defaultValue={this.state.registerAs[0]}
                  dropdownIconPosition="right"
                  defaultButtonText="Choose Category "
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        resizeMode="contain"
                        source={dropdownGreyIcon}
                        style={{width: 20}}
                      />
                    );
                  }}
                  buttonTextStyle={{
                    textAlign: 'left',
                    color: Colors.GRAY_1,
                    fontSize: 16,
                  }}
                  buttonStyle={{
                    backgroundColor: Colors.WHITE,
                    width: '100%',
                    marginTop: 5,
                  }}
                  onSelect={(selectedItem, index) => {
                    // console.warn(selectedItem, index)
                    this.setState({registeredAs: selectedItem});
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item;
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.WHITE,
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    height: 50,
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text style={{color: Colors.GRAY_1}}>Choose file</Text>
                  </View>
                  <View>
                    <Image
                      resizeMode="contain"
                      source={attachmentIcon}
                      style={{width: 15}}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  marginTop: 10,
                  marginHorizontal: 20,
                  // borderRadius: 20,
                }}>
                <TextInput
                  style={{height: 120, textAlignVertical: 'top', padding: 20}}
                  // onChangeText={onChangeNumber}
                  // value={number}
                  placeholderTextColor={Colors.GRAY_1}
                  placeholder="Description Here"
                  multiline
                />
              </View>

              <View style={{marginVertical: 20, marginHorizontal: 20}}>
                <Button
                  name="Upload"
                  backgroundColor={Colors.BLUE}
                  textStyle={{color: Colors.WHITE, fontWeight: 'bold'}}
                />
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  isSelectedView: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  isNotSelectedView: {
    backgroundColor: Colors.GRAY_4,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  sheetBody: {
    marginVertical: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  closeImage: {width: 60, height: 20},
});
