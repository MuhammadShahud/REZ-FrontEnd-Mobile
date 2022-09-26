import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from '../../Styles';
import { eyeIcon } from '../../Assets';
import StarRating from 'react-native-star-rating-widget';

export class RatingReviewsView extends Component {
  render() {
    const { reviewImage, reviewName, reviewStarRating, reviewRating, reviewDescription } =
      this.props;
    return (
      <View style={styles.mainView}>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <Image source={reviewImage} style={{ width: 80, height: 80, resizeMode: 'cover', borderRadius: 360 }} />
          <View
            style={{
              marginHorizontal: 10,
              alignSelf: 'center',
            }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 20, marginHorizontal: 6 }}>
              {reviewName}
            </Text>
            <View style={{ flexDirection: 'row', marginVertical: 2 }}>
              <StarRating
                rating={reviewStarRating}
                onChange={() => null}
                color={Colors.BLUE}
                starSize={15}
                starStyle={{ width: '7%' }}
              />
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{'(' + reviewRating + ')'}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text>
            {reviewDescription}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    marginVertical: 10
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
export default RatingReviewsView;
