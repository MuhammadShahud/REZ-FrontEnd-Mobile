import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { yellowShirt } from '../../../Assets';
import { Header } from '../../../Components';
import { Colors } from '../../../Styles';
import PlayerRequestTeamMiddleware from '../../../Store/Middleware/PlayerRequestTeamMiddleware';
import TeamDetailsMiddleware from '../../../Store/Middleware/TeamDetailsMiddleware';
import { connect } from 'react-redux';

import { img_url } from '../../../Store/Apis';
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTeamRequest: false,
    };
  }


  componentDidMount() {
    // this.props.getEClasses();
    this.props.teamDetails({
      id: this.props?.route.params.item.id,
    });

    this.props.checkIsPlayerJoinTeam().then(data => {
      this.setState({ isTeamRequest: data.isTeam })
    }).catch();

    return;
  }

  fetchteamDetails = () => {
    this.props.teamDetails({
      id: this.props?.route.params.item.id,
    });
  }

  PlayerRequestTeam = (details) => {
    this.props
      .playerRequestTeam({ id: details?.id })
      .then(() => {
        this.props.teamDetails({
          id: this.props?.route.params.item.id,
        });
      })
      .catch();
  };

  render() {
    // console.log('teamDetailsDataaaaaaaaaaa', this.props?.teamDetailsData)
    // console.log('teamDetailsDataaaaaaaaaaa', this.props.route.params)
    const details = this.props?.teamDetailsData
    const { isTeamRequest } = this.state

    const { item } = this.props.route.params
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.WHITE, paddingHorizontal: 24 }}
      >
        <Header
          title={details?.username}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <ScrollView showsVerticalScrollIndicator={false}>

          <Image
            source={details?.profile_image ? {
              uri: img_url + details?.profile_image
            } : yellowShirt}
            style={{ width: '100%', height: 300, resizeMode: 'contain' }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OthersProfile', { item: details })}
              style={{
                width: '48%',
                paddingVertical: 12,
                backgroundColor: Colors.BLUE,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Colors.WHITE,
                }}>
                View Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('TeamRoster', { item: details })}
              style={{
                width: '48%',
                paddingVertical: 12,
                backgroundColor: Colors.BLUE,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: Colors.WHITE,
                }}>
                View Roster
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              paddingVertical: 8,
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.BLACK,
            }}>
            {details?.username}
          </Text>
          <Text>{"Sport Name: " + details?.sportname}</Text>

          <Text style={{ paddingVertical: 10 }}>
            {details?.description ? details?.description : 'No Team Description'}
          </Text>

          <Text>
            Number Of Players:{' '}
            <Text style={{ fontSize: 14 }}>
              {details?.totalplayer}
            </Text>
          </Text>

          {/* <Text style={{paddingVertical: 8}}>
          Rank:{' '}
          <Text style={{fontSize: 16, fontWeight: 'bold', color: Colors.BLACK}}>
            07
          </Text>
        </Text> */}

          <Text>
            Level:{' '}
            <Text >
              {details?.level}
            </Text>
          </Text>
          {details?.playerexistinteam && this.state.isTeamRequest ? (null) : (
            <View>
              {details?.playerrequesttoteam ? (
                <TouchableOpacity
                  onPress={() => this.PlayerRequestTeam(details)}
                  // disabled
                  style={{
                    marginVertical: 20,
                    paddingVertical: 12,
                    backgroundColor: Colors.GREEN,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: Colors.WHITE,
                    }}>
                    Requested
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.PlayerRequestTeam(details)}
                  style={{
                    marginVertical: 20,
                    paddingVertical: 12,
                    backgroundColor: Colors.BLUE,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: Colors.WHITE,
                    }}>
                    Request
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    teamDetailsData: state.TeamDetailsReducer.teamDetailsData,
    playerRequestTeamData: state.PlayerRequestTeamReducer.playerRequestTeamData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    teamDetails: payload => dispatch(TeamDetailsMiddleware.teamDetails(payload)),
    playerRequestTeam: payload => dispatch(PlayerRequestTeamMiddleware.playerRequestTeam(payload)),
    checkIsPlayerJoinTeam: () => dispatch(PlayerRequestTeamMiddleware.checkIsPlayerJoinTeam()),


  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
// export default index;
