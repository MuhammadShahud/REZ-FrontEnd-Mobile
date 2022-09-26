import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from '../../Styles';
import { eyeIcon } from '../../Assets';
import StarRating from 'react-native-star-rating-widget';

export class CoachProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: '',
    };
  }

  render() {
    const {
      profileImage,
      profileName,
      profileSports,
      profileCoaching,
      description,
      profileStars,
    } = this.props;
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 30,
          width: 140,
          height: 150,
          marginTop: 60,
          marginHorizontal: 10,
          borderColor: Colors.GRAY_2,
        }}>
        <View style={{ marginTop: -50, alignItems: 'center' }}>
          <Image
            source={profileImage}
            resizeMode="contain"
            style={{ width: 80, height: 80 }}
          />
          <View style={{ marginTop: 2 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
              {profileName}
            </Text>
          </View>

          <View style={{ marginTop: 2 }}>
            <Text style={{ fontSize: 12 }}>{profileSports + ' Trainer'}</Text>
          </View>

          {/* <View style={{ marginTop: 2 }}>
            <Text style={{ fontSize: 12 }}>
              {'Coaching : ' + profileCoaching + ' Years'}
            </Text>
          </View> */}
          {/* {description == null ? null : (
            <View style={{marginTop: 2}}>
              <Text style={{fontSize: 12}} numberOfLines={2}>
                {'Description : ' + description}
              </Text>
            </View>
          )} */}

          <View style={{ marginTop: 2 }}>
            <StarRating
              rating={profileStars}
              onChange={() => null}
              color={Colors.GREEN}
              starSize={15}
              starStyle={{ width: '5%' }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.GRAY_1,
  },
  bgImage: { height: 140, width: '100%' },
  descriptionView: { paddingHorizontal: 20, marginBottom: 10 },
  descriptionText: { fontWeight: 'bold', fontSize: 16 },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  eyeIcon: { height: 20, width: 20 },
  viewsText: { textAlignVertical: 'center', marginHorizontal: 5 },
  sportText: { textAlignVertical: 'center', marginHorizontal: 5 },
});
export default CoachProfile;
