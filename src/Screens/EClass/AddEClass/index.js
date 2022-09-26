import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  attachmentIcon,
  calendar,
  dropdownGreyIcon,
  imageIcon,
} from '../../../Assets';
import { Button, Header, Loader, Text } from '../../../Components';
import { Colors } from '../../../Styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import EClassMiddleware from '../../../Store/Middleware/EClassMiddleware';
import { connect } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsName: '',
      durations: [
        { key: 30, label: '30 minutes' },
        { key: 60, label: '60 minutes' },
        { key: 90, label: '1.5 Hour' },
        { key: 120, label: '2 Hours' },
        { key: 150, label: '2.5 Hours' },
      ],
      selectedDuration: '',
      date: '',
      time: '',
      amount: '',
      file: null,
      description: '',

      dateModal: false,
      timeModal: false,

      loader: false,
    };
  }

  resetState = () => {
    this.setState({
      sessionsName: '',
      selectedDuration: '',
      date: '',
      time: '',
      amount: '',
      file: null,
      description: '',
      dateModal: false,
      timeModal: false,
      loader: false,
    });
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };
  onPressDate = () => {
    this.setState({ dateModal: true });
  };

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.dateModal}
        mode={'date'}
        date={this.state.date ? this.state.date : new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          console.log(date);
          this.setState({ dateModal: false, date: date });
        }}
        onCancel={() => this.setState({ dateModal: false })}
      />
    );
  };
  renderTimeModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.timeModal}
        mode={'time'}
        date={this.state.time ? this.state.time : new Date()}
        minimumDate={new Date()}
        is24hourSource={'device'}
        onConfirm={time => {
          this.setState({ timeModal: false, time: time });
        }}
        onCancel={() => {
          this.setState({ timeModal: false });
        }}
      />
    );
  };

  onPressChooseFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({});
      console.log(res);
      this.setState({ file: res });
    } catch (err) {
      console.log(err);
    }
  };

  onPressAddEClass = () => {
    const {
      sessionsName,
      selectedDuration,
      date,
      time,
      amount,
      file,
      description,
    } = this.state;
    let eClassDate = new Date(date);
    let dateInFormat = `${eClassDate.getFullYear()}-${eClassDate.getMonth() + 1
      }-${eClassDate.getDate()}`;

    let eClassTime = new Date(time);
    let eClassTimeInFormat = `${eClassTime.getHours()}:${eClassTime.getMinutes()}:${eClassTime.getSeconds()}`;

    let classObj = {
      session_name: sessionsName,
      duration: selectedDuration,
      date: dateInFormat,
      time: eClassTimeInFormat,
      price: amount,
      file: file,
      description: description,
    };

    if (
      sessionsName &&
      selectedDuration &&
      date &&
      time &&
      amount &&
      file &&
      description
    ) {
      this.setState({ loader: true }, () => {
        this.props
          .createEClass(classObj)
          .then(() => {
            this.resetState();
            alert("Successfully Created!")
            this.props.navigation.goBack();
          })
          .catch(() => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('All fields are required');
    }
  };

  render() {
    const { sessionsName, description, date, time, durations, amount, file } =
      this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Header
            title="E- Classes"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View style={styles.mainView}>
            <View
              style={{
                backgroundColor: Colors.GRAY_2,
                borderRadius: 20,
                padding: 10,
                // flex: 0.8,
                marginVertical: 10,
                // justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  marginTop: 10,
                  marginHorizontal: 20,
                  // borderRadius: 20,
                }}>
                <TextInput
                  style={{ paddingHorizontal: 15 }}
                  onChangeText={text => this.handleChange('sessionsName', text)}
                  value={sessionsName}
                  placeholderTextColor={Colors.GRAY_1}
                  placeholder="Session name"
                />
              </View>
              <View
                style={{ width: '100%', marginTop: 10, paddingHorizontal: 20 }}>
                <SelectDropdown
                  data={durations}
                  dropdownIconPosition="right"
                  defaultButtonText="Duration"
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        resizeMode="contain"
                        source={dropdownGreyIcon}
                        style={{ width: 20 }}
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
                    this.setState({ selectedDuration: selectedItem.key });
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label;
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '86%',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  height: 60,
                }}>
                <TouchableOpacity
                  onPress={this.onPressDate}
                  style={{
                    backgroundColor: Colors.WHITE,
                    marginTop: 10,
                    width: '45%',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ paddingHorizontal: 15, color: Colors.GRAY_1 }}>
                    {date ? new Date(date).toLocaleDateString() : 'Date'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ timeModal: true })}
                  style={{
                    backgroundColor: Colors.WHITE,
                    marginTop: 10,
                    width: '45%',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ paddingHorizontal: 15, color: Colors.GRAY_1 }}>
                    {time ? moment(time).format('LT') : 'Time'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  marginTop: 10,
                  marginHorizontal: 20,
                  // borderRadius: 20,
                }}>
                <TextInput
                  style={{ paddingHorizontal: 15 }}
                  onChangeText={text => this.handleChange('amount', text)}
                  value={amount}
                  placeholderTextColor={Colors.GRAY_1}
                  placeholder="Amount"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                onPress={() => this.onPressChooseFile()}
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
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: Colors.GRAY_1 }}>
                      {file ? file.name : `Choose File`}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Image
                      resizeMode="contain"
                      source={imageIcon}
                      style={{ width: 15 }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}>
                <TextInput
                  style={{ height: 120, textAlignVertical: 'top', padding: 20 }}
                  onChangeText={text => this.handleChange('description', text)}
                  value={description}
                  placeholderTextColor={Colors.GRAY_1}
                  placeholder="Description Here"
                  multiline
                />
              </View>

              <View style={{ marginVertical: 20, marginHorizontal: 20 }}>
                <Button
                  name="Add"
                  onPress={this.onPressAddEClass}
                  backgroundColor={Colors.BLUE}
                  textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
                />
              </View>
            </View>
          </View>
          {this.renderDateModal()}
          {this.renderTimeModal()}
          <Loader loader={this.state.loader} />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapsDispatchToProps = dispatch => {
  return {
    createEClass: payload => dispatch(EClassMiddleware.createEClass(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  mainView: {
    // flex: 1,
    // justifyContent: 'center',
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
  closeImage: { width: 60, height: 20 },
});
