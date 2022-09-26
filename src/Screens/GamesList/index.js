import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {
  bell,
  dummy,
  Logo,
  menu,
  game1,
  game2,
  game3,
  game4,
  game5,
  game6,
  close,
} from '../../Assets';
import {Text, Button} from '../../Components';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware';
import {Colors} from '../../Styles';
import {img_url} from '../../Store/Apis';

class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getSportTypes();
  }

  onPressSport = item => {
    this.props.updateSportType({sportTypeID: item.id}).then(() => {
      this.props.navigation.navigate('BottomTab');
    });
  };

  renderGameItem = (gameName, image, item) => {
    console.warn(item);
    return (
      <View style={{width: 140, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.props.onPressSport(item)}>
          <Image
            // resizeMode={'contain'}
            source={{uri: img_url + item.image}}
            style={styles.sportImage}
          />
          <Text style={styles.gamesText}>{gameName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {sportTypes} = this.props;
    return (
      <LinearGradient
        start={{x: 0.8, y: 0.0}}
        end={{x: 0.1, y: 1.0}}
        locations={[0.4, 0.9]}
        colors={[Colors.GREEN, Colors.BLUE]}
        style={styles.linearGradient}>
        <View style={{flex: 1}}>
          <FlatList
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-evenly',
              // alignItems: 'center',
              marginTop: 60,
            }}
            data={sportTypes}
            renderItem={({item}) => {
              console.warn('dsada', item);
              return this.renderGameItem(item.sportname, game1, item);
            }}
          />
        </View>
        {/* <View style={styles.bottomBtnContainer}>
          <Button
            name={'Continue'}
            textStyle={styles.btntext}
            onPress={() => null}
          />
        </View> */}
        <TouchableOpacity
          onPress={this.props.onPressCloseIcon}
          style={{position: 'absolute', right: 25, top: 25}}>
          <View>
            <Image
              source={close}
              style={{width: 15, height: 15}}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    sportTypes: state.Auth.sportTypes,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getSportTypes: () => dispatch(AuthMiddleware.getSportTypes()),
    updateSportType: payload =>
      dispatch(AuthMiddleware.updateSportType(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(GamesList);
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  sportImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    alignSelf: 'center',
  },
  gamesText: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  bottomBtnContainer: {
    paddingHorizontal: 25,
    marginVertical: 15,
  },
  btntext: {
    color: Colors.WHITE,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  icon: {
    height: 22,
    width: 20,
  },
  marginLeft10: {
    marginLeft: 10,
  },
});
