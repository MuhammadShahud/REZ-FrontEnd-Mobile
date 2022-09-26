import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { footballBg } from '../../../Assets/index';
import { Header, Loader, Text } from '../../../Components';
import { Colors } from '../../../Styles';
import { img_url } from '../../../Store/Apis';
import { connect } from 'react-redux';
import EClassMiddleware from '../../../Store/Middleware/EClassMiddleware';
import moment from 'moment'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      eclass: null,
    };
  }

  componentDidMount() {
    const eclass = this?.props?.route?.params?.eclass;
    this.setState({ eclass });
  }
  onPressEnrollCourse = () => {
    const eclass = this.state.eclass;
    if (
      (this.props.role != 'player' && this.props.role != 'parent' &&
        !this.props.user?.parentMembership &&
        !this.props.user?.membership) ||
      (this.props.role != 'player' && this.props.role != 'parent' && !this.props.user?.membership)
    ) {
      this.props.navigation.navigate('MemberShip');
    } else {
      this.props.navigation.navigate('Payment', {
        screen: 'EClassDetails',
        showModal: card_id => {
          let payload = {
            eclass_id: eclass.id,
            payment_method_id: card_id,
          };
          this.setState({ loader: true }, () => {
            this.props
              .orderEClass(payload)
              .then(() => this.setState({ loader: false }))
              .catch(() => this.setState({ loader: false }));
          });
        },
      });
    }
  };

  render() {
    let eclass_id = this.state.eclass?.id;
    let eclass;
    if (eclass_id) {
      eclass = this.props.e_classes_list.find(x => x.id === eclass_id);
    }
    console.log('ROLE=>', this.props.role);
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Header
            title={'E-Class'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        {eclass && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              <View
                style={{
                  backgroundColor: Colors.GRAY_2,
                  height: 400,
                  paddingBottom: 60,
                  borderRadius: 20,
                }}>
                <Image
                  source={{ uri: `${img_url}${eclass?.file_path}` }}
                  style={styles.imgPromo}
                />
              </View>

              <View style={styles.DetailBody}>
                <Text style={styles.HeadingBlack}>{eclass?.session_name}</Text>
                <Text style={styles.DetailPara}>{eclass?.description}</Text>
                <View style={styles.OptionView}>
                  <Text style={styles.Heading}>Date:</Text>
                  <Text style={styles.ShortHeadingInner}>{eclass?.date}</Text>
                </View>
                <View style={styles.OptionView}>
                  <Text style={styles.Heading}>Time:</Text>
                  <Text style={styles.ShortHeadingInner}>{moment(eclass?.time, 'hh:mm a').format('LT')}</Text>
                </View>
                <View style={styles.OptionView}>
                  <Text style={styles.Heading}>Duration:</Text>
                  <Text style={styles.ShortHeadingInner}>
                    {eclass?.duration + ' mins'}
                  </Text>
                </View>
                <View style={styles.footerContainer}>
                  <View style={styles.amountCartContainer}>
                    <View style={styles.amountContainer}>
                      <View>
                        <Text style={{ fontSize: 16 }}>Total</Text>
                        <Text style={{ fontSize: 16 }}>Amount</Text>
                      </View>

                      <Text style={styles.price}>${eclass?.price}</Text>
                    </View>

                    {eclass.bookedByYou == false &&
                      this.props.role !== 'facility' &&
                      this.props.role !== 'staff' &&
                      eclass?.created_by?.id != this.props.user?.id ? (
                      <View style={styles.cartContainer}>
                        <TouchableOpacity
                          onPress={this.onPressEnrollCourse}
                          activeOpacity={0.7}
                          style={[styles.cartBtn]}>
                          <Text style={styles.btnText}>Enroll Course</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        <Loader loader={this.state.loader} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    e_classes_list: state.EClassReducer.e_classes_list,
    role: state.Auth.role,
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    orderEClass: payload => dispatch(EClassMiddleware.orderEClass(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  body: {
    flex: 1,
    marginHorizontal: 20,
    // backgroundColor: 'pink',
    paddingBottom: 10,
  },

  imgPromo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  DetailBody: {
    flex: 0.5,
  },
  HeadingBlack: {
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 20,
    fontWeight: 'bold',
  },
  Heading: {
    fontSize: 14,
    color: Colors.BLACK,
    // marginVertical: 10,
    fontWeight: 'bold',
  },
  DetailPara: {
    fontSize: 13,
    color: Colors.GRAY_1,
    marginBottom: 10,
    marginTop: 20,
  },
  ShortHeading: {
    fontSize: 15,
    color: Colors.GRAY_5,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  ShortHeadingInner: {
    fontSize: 14,
    color: Colors.GRAY_1,
    marginHorizontal: 10,
    fontWeight: 'normal',
  },
  OptionView: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  footerContainer: {
    flex: 1,
  },
  amountCartContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_2,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    paddingRight: 20,
    fontSize: 20,
    color: Colors.BLACK,
  },
  cartContainer: {
    flex: 1,
    marginVertical: 8,
  },
  cartBtn: {
    paddingVertical: 12,
    backgroundColor: Colors.BLUE,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
