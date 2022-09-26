import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import {Button, TextInput, Text, Header, Tag, Post} from '../../../Components';
import {
  baseball,
  basketball,
  cricket,
  cricketBg,
  eyeIcon,
  FbIcon,
  filterIcon,
  football,
  footballBg,
  GoogleIcon,
  hockey,
  hockeyBg,
  homeBg1,
  Logo,
  searchIcon,
} from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../Styles';
import {dummy} from '../../../Assets';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      SearchList: [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          image: dummy,
          name: 'Stacy Doe',
          game: 'Football Player',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          image: dummy,
          name: 'Stacy Doe',
          game: 'Football Player',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          image: dummy,
          name: 'Stacy Doe',
          game: 'Football Player',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          image: dummy,
          name: 'Stacy Doe',
          game: 'Football Player',
        },
      ],
    };
  }

  renderSearchList = () => (
    <TouchableOpacity style={{flexDirection: 'row', marginVertical: 10}}>
      <Image
        source={dummy}
        style={{width: 60, height: 60, marginHorizontal: 10}}
      />
      <View style={{justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold'}}>Stacy Doe</Text>
        <Text>Football Player</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Home"
            isShowLeftIcon={false}
            navigation={this.props.navigation}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: Colors.GRAY_4,
              alignItems: 'center',
              height: 50,
              borderRadius: 20,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}>
            <View>
              <Image
                source={searchIcon}
                style={{height: 15, width: 15}}
                resizeMode={'contain'}
              />
            </View>
            <View style={{width: '90%'}}>
              <TextInput placeholder="Search here" />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 20}}>
            <View style={styles.tagsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Tag isActive={true} text={'Teammates'} />
                <Tag isActive={false} text={'Highlights '} />
                <Tag isActive={false} text={'Schedule'} />
                <Tag isActive={false} text={'Coaches'} />
                <Tag isActive={false} text={'Facilities'} />
              </ScrollView>
            </View>

            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.SearchList}
                renderItem={() => this.renderSearchList()}
              />
            </View>
          </ScrollView>
        </View>
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
});
