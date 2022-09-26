import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Header } from '../../../Components';
import { Colors } from '../../../Styles';
import { connect } from 'react-redux';
import MeshCalenderMiddleware from '../../../Store/Middleware/MeshCalenderMiddleware';

class index extends Component {
  state = {
    dateList: [
      { date: '23 sep', day: 'Wed', startTime: '1:00 PM', endTime: '2:00 PM' },
      { date: '24 sep', day: 'Fri', startTime: '3:00 PM', endTime: '5:00 PM' },
      { date: '25 sep', day: 'Sat', startTime: '6:00 PM', endTime: '7:00 PM' },
      { date: '28 sep', day: 'Mon', startTime: '12:00 PM', endTime: '2:00 PM' },
    ],
  };

  renderDateList = ({ item }) => (
    <View style={styles.dateListContainer}>

      <View>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.GREEN }}>
          {item?.session_date?.slice(0, 10)}
        </Text>
        <Text style={{ textAlign: 'center' }}>{item?.session_day}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 17,
            fontWeight: 'bold',
            color: Colors.BLACK,
          }}>
          {item?.start_time} - {item?.end_time}
        </Text>
      </View>
    </View>
  );

  render() {
    let item = this.props.route.params?.item
    console.warn(item)
    return (
      <View style={styles.container}>
        <Header
          title="Mesh Calendar"
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        {/* {item?.FreeSessions == [] ? (
          <View>
            <Text style={{ textAlign: 'center' }}>There is no active bookings!</Text>
          </View>
        ) : ( */}

        <View>
          <Text style={styles.title}>
            You have below listed hours/slots free on this dates
          </Text>

          {/* <Text style={styles.timeCounter}>8 hrs : 20 mins</Text> */}
          <Text style={styles.timeCounter}>{item?.totalTime}</Text>


          <FlatList
            data={item?.FreeSessions}
            renderItem={this.renderDateList}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => {
              return (
              !item?.FreeSessions.length ? (
                <View>
                  <Text style={{ textAlign: 'center' }}>There is no active bookings!</Text>
                </View> ) : null
              )
                
              }}

          />
        </View>
        {/* )} */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    meshCalenderData: state.MeshCalenderReducer.meshCalenderData,

  };
};
const mapsDispatchToProps = dispatch => {
  return {

    meshCalenderGenerator: payload =>
      dispatch(MeshCalenderMiddleware.meshCalenderGenerator(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, paddingHorizontal: 18 },
  title: {
    textAlign: 'center',
    paddingHorizontal: 55,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  timeCounter: {
    fontSize: 16,
    paddingVertical: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.GREEN,
  },
  dateListContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: Colors.GRAY_PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// export default index;
