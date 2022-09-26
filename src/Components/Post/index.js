import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../Styles';
import {commentIcon, dummy, eyeIcon, likeIcon, shareIcon} from '../../Assets';
import {} from '../../Components';

export class Post extends Component {
  render() {
    const {profileImage, ProfileName, PostTime, PostDescription, postImage} =
      this.props;
    return (
      <View style={styles.mainView}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image source={profileImage} style={{width: 60, height: 60}} />
          </View>
          <View style={{marginHorizontal: 15}}>
            <Text style={{fontWeight: 'bold'}}>{ProfileName}</Text>
            <Text>{PostTime}</Text>
          </View>
        </View>
        <View style={{marginVertical: 10}}>
          <Text>{PostDescription}</Text>
        </View>
        <View style={{borderRadius: 20}}>
          <Image
            source={postImage}
            resizeMode="stretch"
            style={styles.bgImage}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            // onPress={onLikePress}
            style={{flexDirection: 'row'}}>
            <Image
              source={likeIcon}
              resizeMode="contain"
              style={{width: 20, height: 20, marginHorizontal: 5}}
            />
            <Text>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={onCommentPress}
            style={{flexDirection: 'row'}}>
            <Image
              source={commentIcon}
              resizeMode="contain"
              style={{width: 20, height: 20, marginHorizontal: 5}}
            />
            <Text>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={onSharePress}
            style={{flexDirection: 'row'}}>
            <Image
              source={shareIcon}
              resizeMode="contain"
              style={{width: 20, height: 20, marginHorizontal: 5}}
            />
            <Text>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    marginVertical: 10,
  },
  bgImage: {
    height: 180,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  descriptionView: {paddingHorizontal: 20, marginBottom: 10},
  descriptionText: {fontWeight: 'bold', fontSize: 16, marginTop: 5},
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  eyeIcon: {height: 20, width: 20},
  viewsText: {textAlignVertical: 'center', marginHorizontal: 5},
  sportText: {textAlignVertical: 'center', marginHorizontal: 5},
});
export default Post;
