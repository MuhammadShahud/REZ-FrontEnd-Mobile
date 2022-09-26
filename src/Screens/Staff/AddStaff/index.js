import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { Component } from 'react';
import { Button, Header, Loader, Text, TextInput } from '../../../Components';
import { Colors } from '../../../Styles';
import SelectDropdown from 'react-native-select-dropdown';
import {
  calendar_gray,
  dropdownIcon,
  person_plus,
  dropdownGreyIcon,
} from '../../../Assets';
import { GamesList } from '../..';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import { connect } from 'react-redux';

class index extends Component {
  state = {
    registerAs: ['Sports', 'Clinic', 'Training', 'Event'],
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    address: '',
    staff_designation: '',
    selectedSportTypeID: '',
    govID: '',
    taxID: '',
    description: '',
    sportTypeModal: false,
    loader: false,
  };

  onChangeText = (key, text) => {
    this.setState({ [key]: text });
  };
  renderSelectSportType = () => {
    return (
      <Modal
        visible={this.state.sportTypeModal}
        style={{}}
        animationType={'slide'}>
        <GamesList
          onPressCloseIcon={() => this.setState({ sportTypeModal: false })}
          onPressSport={sport =>
            this.setState({
              selectedSportTypeID: sport.id,
              sportTypeModal: false,
            })
          }
        />
      </Modal>
    );
  };

  onPressAddStaff = () => {
    const {
      username,
      email,
      phoneNumber,
      password,
      govID,
      taxID,
      selectedSportTypeID,
      description,
      staff_designation,
    } = this.state;

    if (
      username &&
      email &&
      phoneNumber &&
      govID &&
      taxID &&
      description &&
      selectedSportTypeID &&
      staff_designation
    ) {
      let signUpObj = {
        username: username,
        email: email,
        phone: phoneNumber,
        role: 'staff',
        govt_id: govID,
        tax_id: taxID,
        details: description,
        sport_type: selectedSportTypeID,
        facility_id: this.props.user?.id,
        position: staff_designation,
        platform: 'Without Password'
      };
      this.setState({ loader: true }, () => {
        this.props
          .registerStaff(signUpObj)
          .then(data => {
            this.setState({ loader: false });
            this.props.navigation.goBack();
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('All fields are required');
    }
  };
  render() {
    const { sportTypes } = this.props;

    let sportType = sportTypes?.find(
      x => x.id === this.state.selectedSportTypeID,
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            isShowLeftIcon={true}
            title={'Add Staff'}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                placeholder={'Username'}
                value={this.state.username}
                onChangeText={text => this.onChangeText('username', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                placeholder={'Email'}
                value={this.state.email}
                onChangeText={text => this.onChangeText('email', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Job Description</Text>
              <TextInput
                placeholder={'Job Description'}
                value={this.state.staff_designation}
                onChangeText={text =>
                  this.onChangeText('staff_designation', text)
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <TextInput
                placeholder={'Phone number'}
                keyboardType="numeric"
                value={this.state.phoneNumber}
                onChangeText={text => this.onChangeText('phoneNumber', text)}
              />
            </View>
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                placeholder={'Password'}
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={text => this.onChangeText('password', text)}
              />
            </View> */}
            <View style={{ width: '100%', marginTop: 10 }}>
              <Text style={{ color: Colors.GRAY_1 }}>Select Sport Type</Text>
              <TouchableOpacity
                onPress={() => this.setState({ sportTypeModal: true })}
                style={[
                  styles.dateContainer,
                  {
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                ]}>
                <Text style={{ color: Colors.GRAY_1 }}>
                  {sportType ? sportType.sportname : 'Sport Type'}
                </Text>
                <Image
                  resizeMode="contain"
                  source={dropdownIcon}
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                placeholder={'Description'}
                value={this.state.description}
                multiline={true}
                style={{ height: 100, textAlignVertical: 'top' }}
                onChangeText={text => this.onChangeText('description', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Goverment ID</Text>
              <TextInput
                placeholder={'Enter Goverment ID'}
                value={this.state.govID}
                onChangeText={text => this.onChangeText('govID', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tax ID</Text>
              <TextInput
                placeholder={'Tax ID'}
                value={this.state.taxID}
                onChangeText={text => this.onChangeText('taxID', text)}
              />
            </View>

            <Button
              onPress={this.onPressAddStaff}
              btnStyle={styles.mv20}
              name={'Add Staff'}
              backgroundColor={Colors.BLUE}
              textStyle={styles.cWhite}
            />
          </ScrollView>
        </View>
        {this.renderSelectSportType()}
        <Loader loader={this.state.loader} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    sportTypes: state.Auth.sportTypes,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getSportTypes: () => dispatch(AuthMiddleware.getSportTypes()),
    registerStaff: payload => dispatch(AuthMiddleware.registerStaff(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  inputContainer: {
    marginVertical: 10,
  },
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
