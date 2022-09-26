import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Text,
} from 'react-native';
import { Button, Header, Tag, Post } from '../../Components';
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
} from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Styles';
import Feed from '../../Components/Feed';
import { connect } from 'react-redux';
import GerneralMiddleware from '../../Store/Middleware/GeneralMiddleware';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.setState({
      refreshing: true,
    })
    this.Privacy()
  }

  Privacy = () => {
    this.props.Privacy({
      callback: response => {

        if (response) {
          console.warn("RES,", response?.data?.data);
          this.setState({
            data: response?.data?.data,
            refreshing: false,
          })

        } else {
          this.setState({ loading: false, refreshing: false, });
        }
      },
    });
  }
  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Privacy Policy"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Privacy Policy
              </Text>

              <Text style={{ marginVertical: 10 }}>
                {this.state?.data}
              </Text>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}
const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
  Privacy: paylaod => dispatch(GerneralMiddleware.Privacy(paylaod)),
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
  closeImage: { width: 60, height: 20 },
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.BLUE,
    width: '20%',
    height: 20,
    position: 'absolute',
    bottom: -10,
  },
});
