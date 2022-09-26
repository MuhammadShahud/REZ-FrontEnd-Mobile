import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Colors} from '../../Styles';
import {eyeIcon, playBlueIcon} from '../../Assets';
import StarRating from 'react-native-star-rating-widget';

export class TrainingSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: '',
    };
  }

  render() {
    const {
        trainingImage,
        trainingType,
        trainingPrice,
        sessionTime,
    } = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: Colors.WHITE,
            padding: 10,
            elevation: 2,
          }}>
          <Image
            source={trainingImage}
            style={{height: 60, width: 60}}
            resizeMode={'contain'}
          />
          <View style={{marginHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', marginHorizontal: 5}}>
              {trainingType}
            </Text>
            <Text style={{marginHorizontal: 5}}>{trainingPrice}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              right: 10,
            }}>
            <Text>{sessionTime}</Text>
            <Image
              source={playBlueIcon}
              style={{height: 20, width: 20, marginHorizontal: 10}}
              resizeMode={'contain'}
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
});
export default TrainingSession;
