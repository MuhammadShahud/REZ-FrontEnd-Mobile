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
  Alert,
} from 'react-native';
import {Button, Header, Tag, Post, Loader} from '../../../Components';
import {
  baseball,
  basketball,
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
  hockey,
  hockeyBg,
  homeBg1,
  imageIcon,
  Logo,
  modalBarIcon,
  options,
  searchIcon,
} from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../Styles';
import Feed from '../../../Components/Feed';
import StarRating from 'react-native-star-rating-widget';
import {connect} from 'react-redux';
import {dummyImage} from '../../../Config';
import {img_url} from '../../../Store/Apis';
import GetCoachesMiddleware from '../../../Store/Middleware/GetCoachesMiddleware';
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: '',
      rating: null,
      loading: false,
    };
  }

  handleChangeEmail = value => {
    this.setState({email: value});
    console.warn(value);
  };

  handleChangeRating = number => {
    this.setState({rating: number});
    console.warn(number);
  };
  handleChangeReview = value => {
    console.warn('Value', value);
    this.setState({review: value});
  };
  OnSave = coach_id => {
    let {review, rating} = this.state;
    //coach_id will come from Params.

    if (review == '' || rating == null) {
      Alert.alert('Please fill all fields...');
    } else {
      console.log('SET TEFVIWE');
      this.setState({loading: true}, () => {
        this.props.setReview({
          coach_id,
          review,
          rating,
          callback: response => {
            if (response) {
              alert(response?.data?.message);
              this.setState({loading: false}, () => {
                this.props.navigation.goBack();
              });
            } else {
              alert('Something went wrong');
            }
          },
        });
      });
    }
  };

  render() {
    let {user} = this.props;
    let params = this.props.route.params;

    console.log('params============>', params);
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Ratings & Reviews"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View style={{justifyContent: 'center', flex: 1}}>
            <View
              style={{
                backgroundColor: Colors.GRAY_2,
                borderRadius: 20,
                padding: 10,
                flex: 0.7,
                marginTop: 40,
              }}>
              <View style={{marginTop: -70, alignItems: 'center'}}>
                <Image
                  source={{
                    uri: img_url + params?.coachImg,
                  }}
                  style={{
                    width: 130,
                    height: 130,
                    resizeMode: 'cover',
                    borderRadius: 360,
                  }}
                />
                <View style={{marginTop: 20}}>
                  <Text style={{fontWeight: 'bold', fontSize: 20}}>
                    {params?.coach_username}
                  </Text>
                </View>
              </View>

              <View style={{alignSelf: 'center', marginVertical: 30}}>
                <StarRating
                  // disabled={false}
                  rating={this.state.rating}
                  onChange={number => this.handleChangeRating(number)}
                  color={Colors.BLUE}
                  starSize={30}
                  starStyle={{}}
                />
              </View>

              <View style={{marginVertical: 5, alignItems: 'center'}}>
                <TextInput
                  placeholder={'Type here.....'}
                  multiline
                  numberOfLines={3}
                  onChangeText={text => this.setState({review: text})}
                  value={this.state.review}
                  // placeholderTextColor={Colors.GRAY_1}
                  style={{
                    height: 100,
                    textAlignVertical: 'top',
                    padding: 10,
                    fontSize: 16,
                    marginVertical: 5,
                    color: Colors.GRAY_1,
                    width: '80%',
                    backgroundColor: Colors.WHITE,
                    paddingHorizontal: 20,
                  }}
                />
              </View>

              <View style={{width: '100%', marginTop: 30}}>
                <Button
                  height={50}
                  width={'80%'}
                  name={'Save'}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: Colors.WHITE,
                  }}
                  backgroundColor={Colors.BLUE}
                  onPress={() => {
                    this.OnSave(params?.coach_id);
                  }}
                />
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={styles.underLine}></View>
            </View>
          </View>
          <Loader loader={this.state.loading} />
        </View>
      </>
    );
  }
}
const mapStateToProps = state => ({
  user: state.Auth.user,
});
const mapDispatchToProps = dispatch => ({
  setReview: payload => dispatch(GetCoachesMiddleware.setReview(payload)),
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
    height: 1,
    position: 'absolute',
    bottom: 15,
  },
});
