import moment from 'moment';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { calendar, clock, dummy, lock, map_marker, person } from '../../../Assets';
import { Text } from '../../../Components';
import { img_url } from '../../../Store/Apis';
import { Colors } from '../../../Styles';
import { useNavigation } from '@react-navigation/native';

export default function App({
  visible,
  toggleIsVisibleScheduleScreen,
  schedule,
}) {
  const navigation = useNavigation();
  React.useEffect(() => {
    sheetRef.current.snapTo(visible ? 0 : 1);
  }, [visible]);

  const renderContent = () => {
    console.log('schedule=>', schedule?.id);
    let item = schedule;
    let title = '';
    let description = '';
    let date = '';
    let time = '';
    let address = '';
    let privacy_type = '';
    let participants = '';

    if (item?.title) {
      title = item?.title;
    }
    if (item?.participants) {
      participants = item?.participants;
    }
    if (item?.description) {
      description = item?.description;
    }
    if (item?.address) {
      address = item?.address;
    }
    if (item?.privacy_type) {
      privacy_type = item?.privacy_type;
    }

    if (item?.type == 'sessions') {
      time = `${moment(item.start_time, 'h:mm a').format('h:mm a')} - ${moment(
        item.end_time,
        'h:mm a',
      ).format('h:mm a')}`;
      date = item.date;
    }
    if (item?.type == 'booked_sessions' || item?.type == 'schedule_list' || item?.type == 'team_schedules') {
      time = `${moment(item.start_time, 'h:mm a').format('h:mm a')} - ${moment(
        item.end_time,
        'h:mm a',
      ).format('h:mm a')}`;
      date = item.booking_date;
    }
    if (item?.type == 'in_leagues') {
      time = `${moment(item.start_time, 'h:mm a').format('h:mm a')}`;
      date = item.start_date;
      title = item?.league_name;
      description = item?.league_description;
      address = item?.venue_address;
    }
    if (item?.type == 'eclasses') {
      time = `${moment(item.time, 'h:mm a').format('h:mm a')}`;
      title = item?.session_name;
      description = item?.description;
      date = item?.date;
    }

    console.log(
      'schedule?.private_location->',
      item?.type,
      date,
      'Item?.date=>',
      item?.date,
    );
    return (
      item && (
        <ScrollView style={styles.container}>
          <TouchableOpacity
            onPress={toggleIsVisibleScheduleScreen}
            style={styles.slideBar}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {item?.room_name != null ?
            <View style={{ marginBottom: 10 }}><Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>Room Details</Text>
              <Text style={styles.Room}>{item?.room_name}</Text>
              {item?.subroom_name != null ? <Text style={styles.Room}>{item?.subroom_name}</Text> : null}
            </View>
            : null
          }
          <View style={styles.eventDetailItemContainer}>
            <Image
              source={calendar}
              style={styles.eventDetailItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.eventDetailItemText}>
              {moment(date).format('LL')}
            </Text>
          </View>
          <View style={styles.eventDetailItemContainer}>
            <Image
              source={clock}
              style={styles.eventDetailItemIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.eventDetailItemText}>{time}</Text>
          </View>
          {address ? (
            <View style={styles.eventDetailItemContainer}>
              <Image
                source={map_marker}
                style={styles.eventDetailItemIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.eventDetailItemText}>{address}</Text>
            </View>
          ) : null}
          {privacy_type ? (
            <View style={styles.eventDetailItemContainer}>
              <Image
                source={lock}
                style={styles.eventDetailItemIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.eventDetailItemText}>{privacy_type}</Text>
            </View>
          ) : null}
          {participants != 0 ?
            <View style={styles.eventDetailItemContainer}>
              <Image
                source={person}
                style={styles.eventDetailItemIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.eventDetailItemText}>{participants}</Text>
            </View>
            : null}





          {schedule?.private_location == '1' &&
            schedule?.status === 'accept' ? (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.GREEN,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
              onPress={() =>
                navigation.navigate('TrackCoach', {
                  coach_id: schedule?.user?.id,
                  username: schedule?.user?.username,
                  email: schedule?.user?.email,
                })
              }>
              <Text style={{ color: Colors.WHITE, fontWeight: 'bold' }}>
                Track
              </Text>
            </TouchableOpacity>
          ) : null}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={schedule.participants}
            renderItem={({ item }) => (
              <Image
                source={{ uri: `${img_url}${item.image}` }}
                style={styles.participantsAvatar}
                resizeMode={'contain'}
              />
            )}
          />
        </ScrollView>
      )
    );
  };

  const sheetRef = React.useRef(null);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={['65%', 0]}
      borderRadius={10}
      renderContent={renderContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255, 255,0.9)',
    height: 550,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  slideBar: {
    backgroundColor: Colors.GRAY_2,
    height: 10,
    width: 100,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 2,
  },
  title: {
    fontSize: 20,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  description: {
    marginVertical: 20,
    color: Colors.GRAY_3,
  },
  Room: {
    marginVertical: 5,
    color: Colors.GRAY_3,
    marginLeft: 5,
    fontSize: 14
  },
  eventDetailItemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  eventDetailItemIcon: {
    width: 30,
    height: 30,
  },
  eventDetailItemText: {
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  participantsAvatar: {
    width: 55,
    height: 55,
    marginHorizontal: 5,
  },
});
