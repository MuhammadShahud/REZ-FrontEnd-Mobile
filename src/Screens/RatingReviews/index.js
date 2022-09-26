import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Text,
  FlatList,
} from 'react-native';
import {Button, Header, Tag, Post, RatingReviews} from '../../Components';
import {
  baseball,
  basketball,
  contactIcon,
  cricket,
  cricketBg,
  dummy,
  editIcon,
  eyeIcon,
  FbIcon,
  filterIcon,
  followButton,
  football,
  footballBg,
  GoogleIcon,
  helpIcon,
  historyIcon,
  hockey,
  hockeyBg,
  homeBg1,
  imageIcon,
  inviteIcon,
  Logo,
  logoutIcon,
  membershipIcon,
  modalBarIcon,
  notificationIcon,
  options,
  ratingIcon,
  rightIcon,
  searchIcon,
} from '../../Assets';
import dummyImage from '../../Config';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../Styles';
import Feed from '../../Components/Feed';
import {connect} from 'react-redux';
import GetCoachesMiddleware from '../../Store/Middleware/GetCoachesMiddleware';
import {img_url} from '../../Store/Apis';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
    };
  }
  componentDidMount = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.props.GetReviews({
      callback: response => {
        if (response) {
          // console.warn("Review RES,", response?.data?.data);
          this.setState({
            data: response?.data?.data,
            refreshing: false,
          });
        } else {
          this.setState({loading: false, refreshing: false});
        }
      },
    });
  };
  handleChangeEmail = value => {
    this.setState({email: value});
    console.warn(value);
  };

  renderReviewsList = item => (
    console.warn('Item', JSON.stringify(item)),
    (
      <View>
        <RatingReviews
          reviewImage={{
            uri: item?.item?.profile_image
              ? img_url + item?.item?.profile_image
              : dummyImage,
          }}
          reviewName={item?.item?.username}
          reviewStarRating={item?.item?.rating}
          reviewRating={item?.item?.rating}
          reviewDescription={item?.item?.review}
        />
      </View>
    )
  );

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Reviews"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <FlatList
            style={{}}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={item => this.renderReviewsList(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            ListEmptyComponent={() => (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 12,
                    color: Colors.black,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  Review not found
                </Text>
              </View>
            )}
          />
        </View>
      </>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  GetReviews: payload => dispatch(GetCoachesMiddleware.GetReviews(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
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
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.BLUE,
    width: '20%',
    height: 20,
    position: 'absolute',
    bottom: -10,
  },
});
