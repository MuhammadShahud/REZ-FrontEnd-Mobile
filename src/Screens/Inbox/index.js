import moment from 'moment';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { dummy } from '../../Assets';
import { Header, Text, Tag } from '../../Components';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import { Colors } from '../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';


class index extends Component {
  state = {
    chatList: [],
    loader: false,
    ischat: false,
    isGroupchat: true,
  };
  componentDidMount() {
    this.props.getChatHeads();
    this.props.getGroupChatHeads();
  }

  onPressInboxItem = item => {
    this.props.navigation.navigate('Chat', { chatHead: item });
  };

  onPressInbox = item => {
    this.props.navigation.navigate('GroupChat', { chatHead: item });
  };

  renderChatList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onPressInboxItem(item)}
        activeOpacity={0.7}
        style={styles.button}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: item.user?.profile_image
                ? `${img_url}${item.user.profile_image}`
                : dummyImage,
            }}
            style={{ width: 65, height: 65, borderRadius: 100 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ color: Colors.GRAY_3, fontWeight: 'bold' }}>
            {item.user.username}
          </Text>
          <Text style={{ color: Colors.GRAY_3 }}>
            {moment(item.updated_at).format('MMM DD YYYY')}
          </Text>
        </View>
        <View style={styles.footer}>
          {item?.unread ? (
            <View style={styles.msgCountContainer}>
              <Text
                style={{
                  color: Colors.WHITE,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                {item.unread}
              </Text>
            </View>
          ) : null}

        </View>
      </TouchableOpacity>
    );
  };

  renderGroupChatList = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => this.onPressInbox(item)}
        onLongPress={() => this.props.navigation.navigate('GroupInfo', { Detail: item })}
        activeOpacity={0.7}
        style={styles.button}>
        <View style={styles.imgContainer}>
          <Image
            source={
              {
                uri: item?.image
                  ? `${img_url}${item.image}`
                  : dummyImage,
              }
            }
            style={{ width: 70, height: 70, borderRadius: 100 }}
          />
          <View style={[styles.imgContainer, { flexDirection: 'row', marginTop: -17, }]}>
            {item.members.map((item, index) => {
              return (
                index < 3 ?
                  <Image
                    key={index}
                    source={{ uri: item.image != null ? `${img_url}${item.image}` : dummyImage }}
                    style={[styles.shadow, { marginTop: index == 0 || index == 2 ? -20 : 0 }]}
                  />
                  : null
              )
            })}
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
          <Text style={{ color: Colors.GRAY_3, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text style={{ color: Colors.GRAY_3 }}>
            {item.last_message_on}
          </Text>
        </View>
        <View style={styles.footer}>
          {item?.unread_messages != 0 ? (
            <View style={styles.msgCountContainer}>
              <Text
                style={{
                  color: Colors.WHITE,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                {item.unread_messages}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  onRefresh = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getChatHeads()
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  onRefreshGroup = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getGroupChatHeads()
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 14 }}>
          <Header
            navigation={this.props.navigation}
            title="Inbox"
            isShowLeftIcon={true}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>

          <Tag
            containerStyle={{ width: 150 }}
            key={1}
            isActive={this.state.ischat}
            text={"Chat"}
            onPress={() => this.setState({ ischat: true, isGroupchat: false })}
          />
          <Tag
            containerStyle={{ width: 150 }}
            key={2}
            isActive={this.state.isGroupchat}
            text={"Group Chat"}
            onPress={() => this.setState({ isGroupchat: true, ischat: false })}
          />
        </View>
        {this.props.chatHeads && this.props.GroupsHead ? (
          this.state.ischat ?
            <FlatList
              key={1}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 40,
                  }}>
                  <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                    No Chat Found
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loader}
                  onRefresh={this.onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
              data={this.props.chatHeads}
              renderItem={this.renderChatList}
            /> : <FlatList
              key={2}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 40,
                  }}>
                  <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                    No Chat Found
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loader}
                  onRefresh={this.onRefreshGroup}
                />
              }
              showsVerticalScrollIndicator={false}
              data={this.props.GroupsHead}
              renderItem={this.renderGroupChatList}
            />
        ) : (
          <ActivityIndicator color={Colors.GREEN} size={'large'} />
        )}
        {this.state.isGroupchat ?
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CreateGroup')}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  button: {
    width: '95%',
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
  },
  footer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgCountContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: Colors.BLUE,
  },
  imgContainer: { flex: 0.4, alignItems: 'center' },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 20,
    height: 20,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  fabBtn: {
    width: 56,
    height: 56,
    bottom: 15,
    right: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
    position: 'absolute',
  },
});

const mapStateToProps = state => {
  return {
    chatHeads: state.ChatReducer.chatHeads,
    GroupsHead: state.ChatReducer.GroupChatHeads,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getChatHeads: () => dispatch(ChatMiddleware.getChatHeads()),
    getGroupChatHeads: () => dispatch(ChatMiddleware.getGroupChatHeads()),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
