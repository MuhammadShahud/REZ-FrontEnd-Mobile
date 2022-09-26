import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../../Styles';
import { LeaguesCard, Text } from '../../../Components';
import { team } from '../../../Assets/index';
import PreviousLeagues from './PreviousLeagues';
import { connect } from 'react-redux';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import moment from 'moment';

class UpcomingLeagues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
    };
  }

  async componentDidMount() {
    await this.props.getLeagues({
      type: 'upcoming',
      callback: data => {
        console.warn('data ==', data);
        if (data) {
          console.warn("ashd", data?.data);
          this.setState({ data: data?.data.upcoming });
        } else {
          alert(data?.message);
        }
      },
    });
  }

  _renderItem = ({ item }) => {

    var days = moment(item?.end_date).fromNow(true)

    return (
      // <TouchableOpacity
      //   onPress={() => this.props.navigation.navigate('LeagueDetails')}>
      <LeaguesCard
        heading={item.league_name}
        club1Image={item.team1_image}
        club1Name={item.team1_name}
        club2Image={item.team2_image}
        club2Name={item.team2_name}
        daysRemaining={days}
        date={item.end_date}
        club1Score={item.team1_score}
        club2Score={item.team2_score}
        upcoming={true}
      />
      // </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          {this.state.data ?
            <FlatList
              data={this.state.data}
              // ListHeaderComponent={() => <Text></Text>}
              ListHeaderComponentStyle={{
                marginBottom: 10,
                marginTop: 10,
              }}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      height: 80,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {!this.state.data.length ? (
                      <Text style={{ fontSize: 18 }}>No league to show</Text>
                    ) : null}
                    {/* <Text>No league to show</Text> */}
                  </View>
                );
              }}
            />
            :
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator size={'large'} color={Colors.BLUE} />
            </View>
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  getLeagues: payload => dispatch(UserMiddleware.getLeagues(payload)),
});

export default connect(null, mapDispatchToProps)(UpcomingLeagues);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  body: {
    width: '92%',
    alignSelf: 'center',
  },
});
