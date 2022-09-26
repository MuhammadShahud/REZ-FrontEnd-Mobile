import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import PaymentAction from '../../Store/Actions/PaymentAction';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import { Loader } from '../../Components';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import UserAction from '../../Store/Actions/UserAction';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isActive: true,
      selectedCardId: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    this.props
      .getPaymenyCardList()
      .then(() => {
        this.setState({
          selectedCardId: this.props.PaymentCard[0].id,
          loading: false,
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  removeCard = (item, index) => {
    let { cards } = this.state;
    cards = this.props.PaymentCard;
    cards.splice(index, 1);
    this.setState({ cards });

    this.props.deletePaymentCard({ id: item.id });
  };

  renderPaymentCards = ({ item, index }) => (
    <View style={styles.cardsContainer}>
      <TouchableOpacity
        onPress={() => this.setState({ selectedCardId: item.id })}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons
          color={Colors.GRAY_3}
          size={16}
          name={
            this.state.selectedCardId === item.id
              ? 'radio-button-checked'
              : 'radio-button-off'
          }
        />

        <FontAwesome
          name="cc-visa"
          size={20}
          color={Colors.BLUE}
          style={{ paddingLeft: 5 }}
        />

        <Text style={{ paddingHorizontal: 22, color: Colors.BLACK }}>
          ***********
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <MaterialIcons name="edit" size={22} color={Colors.GRAY_3} />
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.removeCard(item, index)}
        style={{ marginHorizontal: 4 }}>
        <MaterialIcons name="delete" size={22} />
      </TouchableOpacity>
    </View>
  );

  PayNow = () => {
    console.log("....................",this.props.cartProducts)
    let screen = this.props?.screen;
    if (screen == 'store') {
      let { selectedCardId } = this.state;
      let { totalPrice, shippingAddress } = this.props;

      this.setState({ loading: true });
      this.props
        .orderProducts({
          card_id: selectedCardId,
          totalPrice,
          shippingAddress,
          cartProducts: this.props.cartProducts,
        })
        .then(data => {
          if (data) {
            this.setState({ loading: false });
            this.props.navigation.navigate('OrderSuccessfull', { screen });
          }
        })
        .catch(err => {
          this.setState({ loading: false });
        });
    } else if (screen == 'bookAppointment') {
      console.warn('sbookAppointment');
      this.props.PayNow(true);
      this.props.showModal(this.state.selectedCardId);
      this.props.navigation.navigate('BookAppointment');
    } else if (screen === 'EClassDetails') {
      this.props.PayNow(true);
      this.props.showModal(this.state.selectedCardId);
      this.props.navigation.navigate('EClassDetails');
    } else if (screen === 'MemberShip') {
      this.props.PayNow(true);
      this.props.showModal(this.state.selectedCardId);
      this.props.navigation.navigate('MemberShip');
    } else if (screen === 'FacilityDetails') {
      this.props.PayNow(true);
      this.props.showModal(this.state.selectedCardId);
      this.props.navigation.goBack();
    } else if (screen === 'FacilityPackage') {
      this.props.PayNow(true);
      this.props.showModal(this.state.selectedCardId);
      this.props.navigation.goBack();
    }
    else if (screen === 'league') {
      let { getLeagueDetail } = this.props;

      let {
        totalPrice,
        leagueId,
        user: {
          roleInfo: { id },
        },
      } = this.props;

      this.setState({ loading: true });
      this.props
        .joinFacilityLeague({
          cardId: this.state.selectedCardId,
          leagueId: leagueId,
          coachId: id,
          amount: totalPrice,
        })
        .then(data => {
          if (data) {
            let leagueDetailCopy = { ...getLeagueDetail };
            let updateItem = { ...leagueDetailCopy, isJoin: true };
            this.setState({ loading: false });

            this.props.updateLeagueDetail(updateItem);
            this.props.navigation.goBack();
          } else {
            this.setState({ loading: false });
          }
        });
    } else {
      console.warn('else');
      this.props.navigation.navigate('BottomTab');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <View style={{ marginHorizontal: 30, marginVertical: 15 }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            Credit or debit card
          </Text>
        </View>

        <View>
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            data={this.props.PaymentCard}
            renderItem={this.renderPaymentCards}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AddPaymentCard')}
          style={styles.addCardBtn}>
          <AntDesign
            name="pluscircleo"
            size={16}
            color={Colors.GRAY_1}
            style={{ paddingRight: 22 }}
          />
          <Text style={styles.addCardText}>Add new card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={
            this.props.PaymentCard.length < 1 ||
            this.state.selectedCardId === undefined
          }
          onPress={this.PayNow}
          style={{
            bottom: 12,
            position: 'absolute',
            width: '90%',
            alignSelf: 'center',
            paddingVertical: 12,
            backgroundColor:
              this.props.PaymentCard.length < 1 ||
                this.state.selectedCardId === undefined
                ? Colors.GRAY_2
                : Colors.BLUE,
          }}>
          <Text
            style={{ textAlign: 'center', fontSize: 18, color: Colors.WHITE }}>
            Pay Now
          </Text>
        </TouchableOpacity>

        <Loader loader={this.state.loading} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
  user: state.Auth.user,
  cartProducts: state.CartReducer?.storeCart,
  PaymentCard: state.PaymentReducer.PaymentCards,
  getLeagueDetail: state.UserReducer.leagueDetail,
});

const mapDispatchToProps = dispatch => ({
  getPaymenyCardList: () => dispatch(StoreMiddleware.getPaymentCardList()),
  deletePaymentCard: payload => dispatch(StoreMiddleware.deleteCard(payload)),
  orderProducts: payload =>
    dispatch(StoreMiddleware.orderProductsItems(payload)),
  joinFacilityLeague: payload => dispatch(UserMiddleware.joinLeague(payload)),
  PayNow: payload => dispatch(PaymentAction.IS_BOOKING_CONFIRM(payload)),
  updateLeagueDetail: payload =>
    dispatch(UserAction.saveLeagueDetails(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
  addCardBtn: {
    paddingVertical: 16,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY_2,
    flexDirection: 'row',
  },
  cardsContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: Colors.GRAY_PRIMARY,
    marginVertical: 8,
  },
  container: { flex: 1, backgroundColor: Colors.backgroundColor },
  addCardText: { textAlign: 'center', fontSize: 16, color: Colors.textColor },
});
