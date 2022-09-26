import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Header, Loader } from '../../Components';
import PaymentAction from '../../Store/Actions/PaymentAction';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import { Colors } from '../../Styles';

class index extends Component {
  state = {
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    loading: false,
  };

  addPaymentCard = () => {
    let { cardName, cardNumber, expiryDate, cvv } = this.state;

    let dateRegex = /^[0-9]{2}[\/][0-9]{4}$/g;

    let currentMonth = new Date().toISOString();
    let currentYear = new Date().getFullYear();

    let split_expiryDate = expiryDate.split('/');

    // console.warn(currentYear);
    // console.warn(split_expiryDate[0]);

    if (cardName.length <= 3) {
      alert('Card name must be atleast 4 characters!');
      return;
    }
    console.warn(cardNumber.length);
    if (cardNumber.length < 16) {
      alert('Card number must be atleast 16 number!');
      return;
    }
    if (
      currentMonth.slice(5, 7) === split_expiryDate[0] &&
      currentYear === Number(split_expiryDate[1])
    ) {
      alert('Expiry date is invalid');
      return;
    }

    if (expiryDate && !dateRegex.test(expiryDate)) {
      alert('Expiry date is invalid');
      return;
    }

    if (cvv.length < 3) {
      alert('Enter a valid cvv');
      return;
    }

    if (cardName && cardNumber && expiryDate && cvv) {
      // let cardDetails = {cardName, cardNumber, expiryDate, cvv};
      this.setState({ loading: true });
      this.props
        .storePaymentCard({ cardName, cardNumber, expiryDate, cvv })
        .then(data => {
          if (data) {
            this.setState({ loading: false });
            ToastAndroid.show('Card added successfully!', 200);
            this.props.navigation.goBack();
          }
        })
        .catch(err => {
          this.setState({ loading: false });
        });
    } else {
      ToastAndroid.show('All fields are required!', 300);
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <View style={{ paddingHorizontal: 25 }}>
          <Header
            title="Add New Card"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>

        <View style={{ marginHorizontal: 30, marginVertical: 15 }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            Credit or debit card
          </Text>
        </View>

        <TextInput
          value={this.state.cardName}
          placeholder="Card Holder Name"
          placeholderTextColor={Colors.GRAY_1}
          onChangeText={text => this.setState({ cardName: text })}
          style={styles.input}
        />

        <TextInput
          value={this.state.cardNumber}
          placeholder="Card Number"
          keyboardType="numeric"
          maxLength={16}
          placeholderTextColor={Colors.GRAY_1}
          onChangeText={text => this.setState({ cardNumber: text })}
          style={[styles.input, { marginVertical: 18 }]}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={this.state.expiryDate}
            placeholder="Expiry Date"
            keyboardType="numeric"
            maxLength={7}
            placeholderTextColor={Colors.GRAY_1}
            onChangeText={text => {
              this.setState({
                expiryDate: text.length == 2 ? text + '/' : text,
              });
            }}
            style={[styles.input, { width: '50%' }]}
          />
          <TextInput
            value={this.state.cvv}
            placeholder="CVV"
            keyboardType="numeric"
            placeholderTextColor={Colors.GRAY_1}
            maxLength={4}
            onChangeText={text => this.setState({ cvv: text })}
            style={[styles.input, { width: '42%' }]}
          />
        </View>

        <TouchableOpacity
          onPress={this.addPaymentCard}
          style={styles.addCardBtn}>
          <Text style={styles.addCardText}>Add Card</Text>
        </TouchableOpacity>

        <Loader loader={this.state.loading} />
      </View>
    );
  }
}

const mapDispathToProps = dispatch => ({
  storePaymentCard: payload =>
    dispatch(StoreMiddleware.addPaymentCard(payload)),
});

export default connect(null, mapDispathToProps)(index);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  addCardText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  title: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textColor,
  },
  addCardBtn: {
    paddingVertical: 16,
    marginVertical: 18,
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
  },
  input: {
    width: '85%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    color: Colors.textColor,
    backgroundColor: Colors.GRAY_PRIMARY,
    paddingVertical: 16,
  },
  inputContainer: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
