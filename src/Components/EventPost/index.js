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

export class EventPost extends Component {
  render() {
    const {profileImage, ProfileName, PostTime,postImage,EventStatus,EventDate,EventDay,EventTitle,EventDescription} = this.props;
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

            <View style={{right: 10, top: 10, position: 'absolute'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.BLUE,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}>
                <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>
                  {EventStatus}
                </Text>
              </TouchableOpacity>
            </View>

        </View>
        
        <View style={{borderRadius: 20,marginTop:10}}>
          <Image source={postImage} resizeMode="stretch" style={styles.bgImage} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop:10}}>
          <View style={{width:'100%',flexDirection:'row'}}>
              <View style={{width:'20%'}}>
                  <Text style={{color:Colors.GREEN,fontWeight:'bold',fontSize:20,textAlign:'center'}}>{EventDate}</Text>
                  <Text style={{fontSize:16,textAlign:'center'}}>{EventDay}</Text>
              </View>
              <View style={{width:'80%'}}>
                  <Text style={{fontWeight:'bold'}}>{EventTitle}</Text>
                  <Text>{EventDescription}</Text>
              </View>
          </View>
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
    marginVertical:10
  },
  bgImage: {
    height: 150,
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
export default EventPost;
