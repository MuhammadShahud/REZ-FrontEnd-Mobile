import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../../Styles';
import { LeaguesCard, Text } from '../../../Components';
import { team } from '../../../Assets/index';
import { connect } from 'react-redux';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import moment from 'moment';

class PreviousLeagues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
    };
  }

  async componentDidMount() {
    await this.props.getLeagues({
      type: 'previous',
      callback: data => {
        if (data) {
          this.setState({ data: data?.data?.previous });
        } else {
          alert(data?.message);
        }
      },
    });
  }

  _renderItem = ({ item }) => {
    console.warn('itemm ==', item);
    var days = moment(item?.end_date).fromNow(true)

    return (
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
        upcoming={false}
      />
    );
  };

  render() {
    // console.warn(this.state.data);
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

export default connect(mapStateToProps, mapDispatchToProps)(PreviousLeagues);

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
