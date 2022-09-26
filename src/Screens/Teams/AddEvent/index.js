import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  calendar_gray,
  check_blue,
  close,
  dropdownGreyIcon,
  dropdownIcon,
  person_plus,
  upload,
} from '../../../Assets';
import {Button, Header, Text, TextInput} from '../../../Components';
import {Colors} from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';

export class AddEvent extends Component {
  state = {
    registerAs: ['Sports', 'Clinic', 'Training', 'Event'],
  };

  componentDidMount() {
    this.sheetRef.snapTo(1);
  }
  renderContent = () => {
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.sheetRef.snapTo(1);
          }}>
          <Image
            source={close}
            style={styles.closeImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={styles.sheetBody}>
          <Image
            source={check_blue}
            style={styles.checkImage}
            resizeMode={'contain'}
          />
          <Text style={styles.sheetHeading}>Your schedule has been added</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <>
        <View style={styles.container}>
          <Header navigation={this.props.navigation} title={'Add Event'} />
          <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Event Type</Text>
            <SelectDropdown
              data={this.state.registerAs}
              defaultValue={this.state.registerAs[0]}
              dropdownIconPosition="right"
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownIcon}
                    style={styles.w20}
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnText}
              buttonStyle={styles.btnStyle}
              onSelect={(selectedItem, index) => {
                this.setState({registeredAs: selectedItem});
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput placeholder={'Title Here'} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline={true}
              placeholder={'Description here'}
              style={styles.inputDescription}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity>
              <TextInput
                editable={false}
                placeholder={'Select Date'}
                endIcon={calendar_gray}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow}>
            <View style={[styles.inputTime, styles.marginRight5]}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput placeholder={'Start Time'} />
            </View>
            <View style={[styles.inputTime, styles.marginLeft5]}>
              <Text style={styles.inputLabel}></Text>
              <TextInput placeholder={'End Time'} />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput placeholder={'Cost (per hour)'} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput placeholder={'Enter Location'} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Invites</Text>
            <SelectDropdown
              data={this.state.registerAs}
              defaultValue={this.state.registerAs[0]}
              dropdownIconPosition="right"
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={person_plus}
                    style={styles.w20}
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnText}
              buttonStyle={styles.btnStyle}
              onSelect={(selectedItem, index) => {
                this.setState({registeredAs: selectedItem});
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Privacy</Text>
            <SelectDropdown
              data={this.state.registerAs}
              defaultValue={this.state.registerAs[0]}
              dropdownIconPosition="right"
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownGreyIcon}
                    style={styles.w20}
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnText}
              buttonStyle={styles.btnStyle}
              onSelect={(selectedItem, index) => {
                this.setState({registeredAs: selectedItem});
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Upload Image</Text>
            <TouchableOpacity>
              <TextInput
                editable={false}
                placeholder={'Upload Image'}
                endIcon={upload}
              />
            </TouchableOpacity>
          </View>
          <Button
            // onPress={() => this.sheetRef.snapTo(0)}
            onPress={() => this.props.navigation.navigate('ScheduleList')}
            btnStyle={styles.mv20}
            name={'Save'}
            backgroundColor={Colors.BLUE}
            textStyle={styles.cWhite}
          />
          </ScrollView>
        </View>
        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[280, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
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
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    color: Colors.GRAY_1,
  },
  inputDescription: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  mv20: {
    marginVertical: 20,
  },
  cWhite: {
    color: Colors.WHITE,
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_1,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: Colors.BLUE_LIGHT,
    width: '100%',
    marginTop: 5,
  },
  w20: {
    width: 20,
  },
  flexRow: {
    flexDirection: 'row',
  },
  inputTime: {
    flex: 1,
    marginTop: 10,
  },
  marginLeft5: {
    marginLeft: 5,
  },
  marginRight5: {
    marginRight: 5,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  closeImage: {
    width: 14,
    height: 14,
  },
  sheetBody: {
    marginVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkImage: {
    width: 40,
    height: 40,
  },
  sheetHeading: {
    fontSize: 18,
    color: Colors.GRAY_3,
    paddingVertical: 5,
  },
  subHeading: {
    fontSize: 22,
    color: Colors.GRAY_3,
    fontWeight: '500',
  },
});

export default AddEvent;
