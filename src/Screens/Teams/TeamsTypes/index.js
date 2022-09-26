import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { yellowShirt } from '../../../Assets';
import { Header, SearchBar, Text } from '../../../Components';
import { Colors } from '../../../Styles';
import TeamsMiddleware from '../../../Store/Middleware/TeamsMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../../Store/Apis';

// import AuthAction from '../../../Store/Actions/AuthAction';

class TeamsTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      searchTeam: null,
    };
  }

  onSelect = (item) => {
    this.props.navigation.navigate('TeamDetail', { item })
  }


  SearchTeam = (text) => {
    let { searchTeam } = this.state;
    // this.handleChangeSearchTeam()
    this.props.getTeamsBysport({
      name: text ? text : '',
    });
    return;
    // clearTimeout(this.timeoutId);
    // if (searchTeam) {
    //   this.timeoutId = clearTimeout(() => {
    //   }, 300);
    // }
  };

  handleChangeSearchTeam = value => {
    this.setState({ searchTeam: value });
  };

  renderTeamList = item => (
    <TouchableOpacity
      // onPress={() => this.props.navigation.navigate( 'TeamDetail')}
      onPress={() => this.onSelect(item)}
      activeOpacity={0.7}
      style={styles.teamContainer}>
      <Image
        source={item?.profile_image ? {
          uri: img_url + item?.profile_image
        } : yellowShirt}
        style={styles.teamImage} />
      <Text style={styles.teamName}>{item.username}</Text>
      <Text
        style={{
          fontSize: 10,
          alignSelf: 'flex-start',
          paddingLeft: 8,
          paddingBottom: 8,
        }}>
        {item.sportname}
      </Text>
    </TouchableOpacity>
  );

  componentDidMount = () => {

    this.SearchTeam();

  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.SearchTeam();
    })
    this.setState({ loader: false })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Header
          title={'Teams'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <SearchBar value={this.state.searchTeam} onChangeText={this.SearchTeam} />
        {this.props?.teamData && this.props?.teamData.length > 0 ?
          <FlatList
            numColumns={2}
            columnWrapperStyle={styles.teamsListContainer}
            style={styles.flex1}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            data={
              this.props?.teamData
            }
            renderItem={({ item }) => this.renderTeamList(item)}
          /> : <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    teamData: state.TeamsReducer.teamsData
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getTeamsBysport: payload => dispatch(TeamsMiddleware.getTeamsBysport(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(TeamsTypes);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  flex1: { flex: 1 },

  teamContainer: {
    marginVertical: 8,
    marginHorizontal: 5,
    backgroundColor: Colors.GRAY_4,
    flex: 1,
    elevation: 2,
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  teamImage: {
    width: '100%',
    height: 120,
  },
  teamsListContainer: {
    justifyContent: 'space-between',
  },
  teamName: {
    paddingTop: 8,
    paddingLeft: 8,
    fontSize: 12,
    color: Colors.BLACK,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
});
