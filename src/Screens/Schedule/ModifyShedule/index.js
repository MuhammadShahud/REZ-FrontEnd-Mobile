import React, {Component} from 'react';
import {
  FlatList,
  Image,
  Modal,
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
import {Button, Header, Loader, Text, TextInput} from '../../../Components';
import {Colors} from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';
import BookingMidleware from '../../../Store/Middleware/BookingMiddleware';
import {connect} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';

class ModifyBooking extends Component {
  state = {
    bookingDetail: null,
    timeSlots: null,
    timeSlotModal: false,
    selectedTimeSlot: null,
    isShowDateModal: false,
    booking_date: null,
    loader: false,
    isEdit: false,
  };

  componentDidMount() {
    this.sheetRef.snapTo(1);
    const bookingDetail = this.props.route?.params?.bookingDetail;
    console.log('bookingDetailbookingDetail', bookingDetail);
    this.setState({bookingDetail, booking_date: new Date(bookingDetail.date)});
    this.props
      .getCoachTimeSlot({session_id: bookingDetail.session_id})
      .then(timeSlots => {
        let selectedTimeSlot = null;
        selectedTimeSlot = timeSlots?.find(x => x.id == bookingDetail?.time_id);

        this.setState({
          timeSlots: timeSlots,
          selectedTimeSlot: selectedTimeSlot,
        });
      })
      .catch(err => console.log(err));
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
          <Text style={styles.sheetHeading}>Your details has been updated</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };

  renderTimeSlot = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.timeSlotModal}
        onRequestClose={() => this.setState({timeSlotModal: false})}>
        <View style={{backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.GRAY_1,
                  marginVertical: 10,
                  textAlign: 'center',
                }}>
                Select available time slot
              </Text>

              <View>
                <FlatList
                  style={{marginVertical: 20}}
                  numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.timeSlots}
                  renderItem={this.renderTimeSlotList}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderTimeSlotList = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        this.setState({
          timeSlotModal: false,
          selectedTimeSlot: item,
        });
      }}>
      <View
        style={{
          backgroundColor: Colors.GREEN,
          width: 100,
          height: 60,
          margin: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: Colors.WHITE}}>{item.start_time}</Text>
      </View>
    </TouchableOpacity>
  );

  onChangeText = (key, value) => {
    let bookingCopy = this.state.bookingDetail;
    bookingCopy[key] = value;
    this.setState({[key]: value, isEdit: true});
  };

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.booking_date ? this.state.booking_date : new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          this.setState({isShowDateModal: false, booking_date: date});
        }}
        onCancel={() => {
          this.setState({isShowDateModal: false});
        }}
      />
    );
  };

  onPressRequest = () => {
    console.log(this.state);
    let copyDate = this.state.booking_date;

    let payload = {
      id: this.state.bookingDetail.id,
      new_amount: this.state.bookingDetail.price,
      location_address: this.state.bookingDetail.location_address
        ? this.state.bookingDetail.location_address
        : this.state.bookingDetail?.address,
      booking_date: `${copyDate.getFullYear()}-${
        copyDate.getMonth() + 1
      }-${copyDate.getDate()}`,
      time_slot_id: this.state.selectedTimeSlot.id,
    };

    this.setState({loader: true}, () => {
      this.props
        .updateBooking(payload)
        .then(() =>
          this.setState({loader: false}, () => {
            this.props.navigation.navigate('Appointments');
          }),
        )
        .catch(() => this.setState({loader: false}));
    });
  };

  render() {
    const {bookingDetail, timeSlots, isEdit} = this.state;
    console.log('timeSlots=>', this.state.timeSlots);
    console.log('bookingDetail=>', bookingDetail);
    console.log('isEdit=>', isEdit);
    console.log('this.state.booking_date=>', this.state.booking_date);
    return (
      <>
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            title={'Modify Details'}
            isShowLeftIcon={true}
          />

          {bookingDetail ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({isShowDateModal: true, isEdit: true})
                  }>
                  <TextInput
                    value={moment(this.state.booking_date).format('LL')}
                    editable={false}
                    placeholder={'Select Date'}
                    endIcon={calendar_gray}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.flexRow}>
                <View style={[styles.inputTime, styles.marginRight5]}>
                  <Text style={styles.inputLabel}>Session Start Time</Text>
                  <TextInput
                    placeholder={'Start Time'}
                    editable={false}
                    value={bookingDetail?.start_time}
                  />
                </View>
                <View style={[styles.inputTime, styles.marginLeft5]}>
                  <Text style={styles.inputLabel}>Session End Time</Text>
                  <TextInput
                    placeholder={'End Time'}
                    editable={false}
                    value={bookingDetail?.end_time}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() =>
                  this.setState({timeSlotModal: true, isEdit: true})
                }>
                <Text style={styles.inputLabel}>Time Slot</Text>
                <TextInput
                  placeholder={'Select Time Slot'}
                  editable={false}
                  value={
                    this.state.selectedTimeSlot
                      ? `${this.state.selectedTimeSlot?.start_time} - ${this.state.selectedTimeSlot?.end_time}`
                      : ''
                  }
                />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  placeholder={'Price'}
                  value={String(bookingDetail.price)}
                  onChangeText={text => this.onChangeText('price', text)}
                  keyboardType={'numeric'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  placeholder={'Enter Location'}
                  value={
                    bookingDetail.location_address
                      ? bookingDetail.location_address
                      : bookingDetail.address
                  }
                  onChangeText={text =>
                    this.onChangeText('location_address', text)
                  }
                />
              </View>

              <Button
                disabled={!this.state.isEdit}
                onPress={this.onPressRequest}
                btnStyle={styles.mv20}
                name={'Request'}
                backgroundColor={
                  !this.state.isEdit ? Colors.GRAY_1 : Colors.BLUE
                }
                textStyle={styles.cWhite}
              />
            </View>
          ) : null}
        </View>
        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[280, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
        <Loader loader={this.state.loader} />
        {this.renderTimeSlot()}
        {this.renderDateModal()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
    // justifyContent:'center'
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxHeight: 450,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_1,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: Colors.GRAY_4,
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

const mapStateToProps = state => {
  return {};
};
const mapsDispatchToProps = dispatch => {
  return {
    getCoachTimeSlot: payload =>
      dispatch(BookingMidleware.getCoachTimeSlot(payload)),
    updateBooking: payload => dispatch(BookingMidleware.updateBooking(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(ModifyBooking);
