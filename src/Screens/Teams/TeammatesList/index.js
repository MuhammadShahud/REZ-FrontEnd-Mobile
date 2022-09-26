import React, { Component } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { dummy } from '../../../Assets';
import { Header, SearchBar, Tag, Text } from '../../../Components';
import { Colors } from '../../../Styles';
import TeammatesMiddleware from '../../../Store/Middleware/TeammatesMiddleware';
import { connect } from 'react-redux';

class TeammatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      searchTeammates: null,

    };
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  componentDidMount = () => {
    // this.props.getMyTeammates();
    this.SearchTeammates();
  };

  SearchTeammates = (text) => {
    let { searchTeammates } = this.state;
    // this.handleChangeSearchTeam()
    this.props.getMyTeammates({
      name: text ? text : '',
    });
    return;
    // clearTimeout(this.timeoutId);
    // if (searchTeam) {
    //   this.timeoutId = clearTimeout(() => {
    //   }, 300);
    // }
  };

  render() {
    console.warn("Teammates");
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Teammates"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
          <SearchBar value={this.state.searchTeammates} onChangeText={this.SearchTeammates} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}>
            {this.props?.teammatesData ?
              <FlatList
                data={this.props?.teammatesData}
                ListEmptyComponent={<Text style={{ alignSelf: 'center' }}>Teammates not found</Text>}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('OthersProfile', { item })}>
                    <View style={styles.eventContainer}>
                      <Image
                        source={dummy}
                        style={styles.avatarImage}
                        resizeMode={'contain'}
                      />
                      <View style={styles.ph15}>
                        <Text style={styles.name}>{item.username}</Text>
                        <Text style={styles.eventCategory}>{item.sportname}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              /> : !this.props?.teammatesData ?
                <ActivityIndicator
                  size={'large'}
                  color={Colors.BLUE}
                  style={styles.loadMoreContentContainer}
                /> : null}


          </ScrollView>
        </View>
      </>
    );
  }
}
const mapStateToProps = state => {
  console.log(state)
  return {
    teammatesData: state.TeammatesReducer.teammatesData
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getMyTeammates: payload => dispatch(TeammatesMiddleware.getMyTeammates(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(TeammatesList);

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
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    elevation: 4,
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  name: {
    fontSize: 19,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  ph15: {
    paddingHorizontal: 15,
  },
  eventCategory: {
    fontWeight: '500',
    color: Colors.GRAY_6,
  },
});
