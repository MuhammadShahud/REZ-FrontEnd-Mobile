import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../Styles';
import {commentIcon, eyeIcon, likeIcon, options, shareIcon} from '../../Assets';

export class Feed extends Component {
  render() {
    const {
      onLikePress,
      onCommentPress,
      onSharePress,
      onOptionPress,
      onFeedPress,
      btnStyle,
      profileImage,
      profileName,
      profileCountry,
      description,
      bgImage,
      updatedDate,
      views,
      sport,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onFeedPress}
        style={[styles.feedView, btnStyle]}>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <Image
            source={profileImage}
            style={{width: 50, height: 50, marginHorizontal: 10}}
          />
          <View>
            <Text style={{fontWeight: 'bold'}}>{profileName}</Text>
            <Text>{profileCountry}</Text>
          </View>
          <TouchableOpacity
            onPress={onOptionPress}
            style={{flexDirection: 'row', position: 'absolute', right: 10}}>
            <Image
              source={options}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>

        <View style={{borderRadius: 20}}>
          <Image source={bgImage} style={styles.bgImage} />
        </View>
        <View style={styles.descriptionView}>
          <Text style={styles.descriptionText}>{description}</Text>
          <Text style={{marginVertical: 5}}>{updatedDate}</Text>
          <View style={styles.dateView}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={onLikePress}
                style={{flexDirection: 'row'}}>
                <Image
                  source={likeIcon}
                  resizeMode="contain"
                  style={{width: 20, height: 20, marginHorizontal: 5}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onCommentPress}
                style={{flexDirection: 'row'}}>
                <Image
                  source={commentIcon}
                  resizeMode="contain"
                  style={{width: 20, height: 20, marginHorizontal: 5}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSharePress}
                style={{flexDirection: 'row'}}>
                <Image
                  source={shareIcon}
                  resizeMode="contain"
                  style={{width: 20, height: 20, marginHorizontal: 5}}
                />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>
              {this.props.views ? (
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={eyeIcon}
                    style={styles.eyeIcon}
                    resizeMode={'contain'}
                  />
                  <Text style={styles.viewsText}>{views + ' Views'}</Text>
                </View>
              ) : (
                <Text style={styles.sportText}>{sport}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
  bgImage: {height: 140, width: '100%'},
  descriptionView: {paddingHorizontal: 20, marginBottom: 10},
  descriptionText: {fontWeight: 'bold', fontSize: 16},
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  eyeIcon: {height: 20, width: 20},
  viewsText: {textAlignVertical: 'center', marginHorizontal: 5},
  sportText: {textAlignVertical: 'center', marginHorizontal: 5},
  feedView: {
    backgroundColor: Colors.GRAY_2,
    borderRadius: 20,
    paddingVertical: 20,
    marginVertical: 10,
  },
});
export default Feed;
