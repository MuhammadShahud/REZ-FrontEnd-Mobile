import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {Button, TextInput, Text, Header, Tag, Post} from '../../Components';
import {
  baseball,
  basketball,
  cricket,
  cricketBg,
  dummy,
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
  Logo,
  modalBarIcon,
  options,
  searchIcon,
} from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../Styles';
import Feed from '../../Components/Feed';
import BottomSheet from 'reanimated-bottom-sheet';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
    };
  }

  handleChangeEmail = value => {
    this.setState({email: value});
    console.warn(value);
  };

  renderContent = () => {
    return (
      <View style={styles.confirmationSheetContainer}>
        <View
          style={{
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: Colors.GRAY_2,
            paddingBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.sheetRef.snapTo(1);
            }}>
            <Image
              source={modalBarIcon}
              style={styles.closeImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* <Text style={{fontWeight: 'bold'}}>In This Post</Text> */}
        </View>
        <View style={styles.sheetBody}>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Image
              source={dummy}
              style={{width: 50, height: 50, marginHorizontal: 10}}
            />
            <View>
              <Text style={{fontWeight: 'bold'}}>Stacy Doe</Text>
              <Text>StacyDoe</Text>
            </View>
            <TouchableOpacity
              style={{flexDirection: 'row', position: 'absolute', right: 10}}>
              <Image
                source={followButton}
                resizeMode="contain"
                style={{width: 80, height: 40}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  componentDidMount() {
    this.sheetRef.snapTo(1);
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Newsfeed"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 20}}>
            <Feed
              onFeedPress={() => this.sheetRef.snapTo(0)}
              onOptionPress={() => console.warn('Option')}
              onLikePress={() => console.warn('like')}
              onCommentPress={() => console.warn('Comment')}
              onSharePress={() => console.warn('Share')}
              profileImage={dummy}
              profileName={'Stacy Doe'}
              profileCountry={'New York'}
              // description={'Lorem Ipsum is simply dummy text of the printing.'}
              bgImage={homeBg1}
              updatedDate={'Today 9:24 am'}
              views={'20'}
            />

            <Feed
              onFeedPress={() => this.sheetRef.snapTo(0)}
              onOptionPress={() => console.warn('Option')}
              onLikePress={() => console.warn('like')}
              onCommentPress={() => console.warn('Comment')}
              onSharePress={() => console.warn('Share')}
              profileImage={dummy}
              profileName={'Stacy Doe'}
              profileCountry={'New York'}
              // description={'Lorem Ipsum is simply dummy text of the printing.'}
              bgImage={homeBg1}
              updatedDate={'Today 9:24 am'}
              views={'20'}
            />
          </ScrollView>
        </View>

        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[180, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
      </>
    );
  }
}

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
});
