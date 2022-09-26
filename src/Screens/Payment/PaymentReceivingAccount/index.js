import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import { Colors } from '../../../Styles';
import { Button, Header, Loader, TextInput } from '../../../Components';
import { connect } from 'react-redux';
import GeneralMiddleware from '../../../Store/Middleware/GeneralMiddleware';

class PaymentReceivingAccount extends Component {
  state = {
    accountName: 'asdasdasd',
    addressLines1: '1212312312',
    addressLines2: '1232132132',
    zipCode: '123',
    ssnNumber: '1233',
    accountNumber: '123456789012',
    routingNumber: '123456789',

    countryList: [],
    selectedCountry: null,
    isShowCountryModal: false,
    countrySearch: '',

    statesList: [],
    selectedState: null,
    isShowStateModal: false,
    stateSearch: '',

    citiesList: [],
    selectedCity: null,
    isShowCityModal: false,
    citySearch: '',

    loader: false,
  };

  componentDidMount() {
    this.props
      .getCountryList()
      .then(countryList => {
        this.setState({ countryList });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onChangeText = (key, value) => this.setState({ [key]: value });

  onPressCountry = item => {
    this.setState(
      {
        selectedCountry: item,
        isShowCountryModal: false,
        selectedState: null,
      },
      () => {
        this.props.getStatesList(item.id).then(states => {
          this.setState({ statesList: states });
        });
      },
    );
  };
  onPressState = item => {
    this.setState(
      {
        selectedState: item,
        isShowStateModal: false,
        selectedCity: null,
      },
      () => {
        this.props.getCitiesList(item.id).then(cities => {
          this.setState({ citiesList: cities });
        });
      },
    );
  };
  onPressCity = item => {
    this.setState({
      selectedCity: item,
      isShowCityModal: false,
    });
  };

  renderCountryModalPicker = () => {
    let countryList = this.state.countryList;
    if (this.state.countrySearch) {
      countryList = this.state.countryList?.filter(x => {
        return x.name.indexOf(this.state.countrySearch) !== -1;
      });
    }
    return (
      <Modal visible={this.state.isShowCountryModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Search</Text>
            <TextInput
              placeholder={'Search'}
              value={this.state.countrySearch}
              onChangeText={text => this.onChangeText('countrySearch', text)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={countryList}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.onPressCountry(item)}
                    key={item?.id}>
                    <Text style={styles.countryNameText}>{item?.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  renderStatesModalPicker = () => {
    let statesList = this.state.statesList;
    if (this.state.stateSearch) {
      statesList = this.state.statesList?.filter(x => {
        return x.name.indexOf(this.state.stateSearch) !== -1;
      });
    }
    return (
      <Modal visible={this.state.isShowStateModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Search</Text>
            <TextInput
              placeholder={'Search'}
              value={this.state.stateSearch}
              onChangeText={text => this.onChangeText('stateSearch', text)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={statesList}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.onPressState(item)}
                    key={item?.id}>
                    <Text style={styles.countryNameText}>{item?.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };
  renderCitiesModalPicker = () => {
    let citiesList = this.state.citiesList;
    if (this.state.citySearch) {
      citiesList = this.state.citiesList?.filter(x => {
        return x.name.indexOf(this.state.citySearch) !== -1;
      });
    }
    return (
      <Modal visible={this.state.isShowCityModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Search</Text>
            <TextInput
              placeholder={'Search'}
              value={this.state.citySearch}
              onChangeText={text => this.onChangeText('citySearch', text)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={citiesList}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.onPressCity(item)}
                    key={item?.id}>
                    <Text style={styles.countryNameText}>{item?.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  onPressSave = () => {
    const {
      accountName,
      accountNumber,
      addressLines1,
      addressLines2,
      selectedCountry,
      selectedState,
      selectedCity,
      routingNumber,
      ssnNumber,
      zipCode,
    } = this.state;
    if (
      accountName &&
      accountNumber &&
      addressLines1 &&
      addressLines2 &&
      selectedCountry &&
      selectedState &&
      routingNumber &&
      ssnNumber &&
      zipCode &&
      selectedCity
    ) {
      let obj = {
        accountName,
        accountNumber,
        addressLines1,
        addressLines2,
        countryCode: selectedCountry.iso2,
        stateCode: selectedState.iso2,
        cityName: selectedCity.name,
        routingNumber,
        ssnNumber,
        zipCode,
      };
      this.setState({ loader: true }, () => {
        this.props
          .addBankAccount(obj)
          .then(data => {
            console.log('datadatadata=>', data);
            this.setState({ loader: false });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('all fields is required');
    }
  };

  render() {
    console.log('useruseruser=>', this.props.user?.account);
    return (
      <View style={styles.container}>
        <Header isShowLeftIcon={true} title={'Account Receiving '} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Name</Text>
            <TextInput
              placeholder={'Account Name'}
              value={this.state.accountName}
              onChangeText={text => this.onChangeText('accountName', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address line 1</Text>
            <TextInput
              placeholder={'Address line 1'}
              value={this.state.addressLines1}
              onChangeText={text => this.onChangeText('addressLines1', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address line 2</Text>
            <TextInput
              placeholder={'Address line 2'}
              value={this.state.addressLines2}
              onChangeText={text => this.onChangeText('addressLines2', text)}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.setState({ isShowCountryModal: true })}
            style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Country</Text>
            <TextInput
              editable={false}
              placeholder={'Select Country'}
              value={
                this.state.selectedCountry
                  ? this.state.selectedCountry?.name
                  : 'Select Country'
              }
              style={{ textAlign: 'center', fontSize: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.selectedCountry ? false : true}
            onPress={() => this.setState({ isShowStateModal: true })}
            style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select State</Text>
            <TextInput
              editable={false}
              placeholder={'Select State'}
              value={
                this.state.selectedState
                  ? this.state.selectedState?.name
                  : 'Select State'
              }
              style={{ textAlign: 'center', fontSize: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.selectedState ? false : true}
            onPress={() => this.setState({ isShowCityModal: true })}
            style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select City</Text>
            <TextInput
              editable={false}
              placeholder={'Select City'}
              value={
                this.state.selectedCity
                  ? this.state.selectedCity?.name
                  : 'Select City'
              }
              style={{ textAlign: 'center', fontSize: 15 }}
            />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Zip Code</Text>
            <TextInput
              placeholder={'Zip Code'}
              value={this.state.zipCode}
              keyboardType={'numeric'}
              onChangeText={text => this.onChangeText('zipCode', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>SSN Number</Text>
            <TextInput
              placeholder={'SSN Number'}
              value={this.state.ssnNumber}
              keyboardType={'numeric'}
              onChangeText={text => this.onChangeText('ssnNumber', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              placeholder={'Account Number'}
              value={this.state.accountNumber}
              keyboardType={'numeric'}
              onChangeText={text => this.onChangeText('accountNumber', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Routing Number</Text>
            <TextInput
              placeholder={'Routing Number'}
              keyboardType={'numeric'}
              value={this.state.routingNumber}
              onChangeText={text => this.onChangeText('routingNumber', text)}
            />
          </View>
          <Button
            onPress={this.onPressSave}
            btnStyle={styles.mv20}
            name={'Save'}
            backgroundColor={Colors.BLUE}
            textStyle={styles.cWhite}
          />
        </ScrollView>
        {this.renderCountryModalPicker()}
        {this.renderStatesModalPicker()}
        {this.renderCitiesModalPicker()}
        <Loader loader={this.state.loader} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getCountryList: () => dispatch(GeneralMiddleware.getCountryList()),
    getStatesList: payload => dispatch(GeneralMiddleware.getStateList(payload)),
    getCitiesList: payload =>
      dispatch(GeneralMiddleware.getCitiesList(payload)),
    addBankAccount: payload =>
      dispatch(GeneralMiddleware.addBankAccount(payload)),
  };
};
export default connect(
  mapStateToProps,
  mapsDispatchToProps,
)(PaymentReceivingAccount);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  mv20: {
    marginVertical: 20,
  },
  inputContainer: {
    marginVertical: 5,
  },
  inputLabel: {
    color: Colors.GRAY_1,
  },
  cWhite: {
    color: Colors.WHITE,
  },
  countryNameText: {
    color: Colors.BLACK,
    fontSize: 16,
    paddingVertical: 5,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    // margin: 20,
    paddingTop: 20,
  },
});
