import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { check_box_checked, check_box_un_check, dummy } from '../../../Assets';
import { Button, Header, Text } from '../../../Components';
import { dummyImage } from '../../../Config';
import { img_url } from '../../../Store/Apis';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import { Colors } from '../../../Styles';

export class InviteFriends extends Component {
  state = {
    loader: false,
  };

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { usersByTypePaginatedObj } = this.props;
      this.props
        .getUsersByType({
          role: this.props.role,
          next_page_url: usersByTypePaginatedObj?.next_page_url,
        })
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { usersByTypePaginatedObj } = this.props;
    const { loader } = this.state;
    return usersByTypePaginatedObj?.next_page_url ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={styles.loadMoreContentContainer}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  render() {
    const { usersByType, selectedUsersIDs, usersByTypePaginatedObj } = this.props;
    return (
      <View style={styles.container}>
        <Header
          isShowLeftIcon={true}
          navigation={this.props.navigation}
          title={this.props.title}
          onPressBack={this.props.onPressBack}
        />

        {usersByTypePaginatedObj ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={usersByType}
            style={styles.usersListContainer}
            ListFooterComponent={this.renderLoaderMoreButton()}
            ListEmptyComponent={<Text style={{ alignSelf: 'center' }}> {this.props.role == "multi_roles" ? "No member found" : "No " + this.props.role + " found"}</Text>}
            renderItem={({ item, index }) => {
              console.warn('item', item);
              const isCheck =
                selectedUsersIDs?.findIndex(x => x?.id == item.id) !== -1
                  ? true
                  : false;
              return (
                <TouchableOpacity
                  key={`${item.id}-friends`}
                  onPress={() =>
                    isCheck
                      ? this.props.removeUserFromSelectedUserIds(item)
                      : this.props.onPressUser(item)
                  }
                  style={styles.userContainer}>
                  <Image
                    source={{
                      uri: item.profile_image
                        ? img_url + item.profile_image
                        : dummyImage,
                    }}
                    style={styles.avatarImage}
                  // resizeMode={'contain'}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                  </View>
                  <Image
                    source={isCheck ? check_box_checked : check_box_un_check}
                    style={styles.checkunCheckImage}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              );
            }}
          />
        ) :
          <View style={{ flex: 1 }}>
            <ActivityIndicator
              size={'large'}
              color={Colors.BLUE}
            />
          </View>
        }
        {this.props.type == 'league' ? (
          <Button
            name={'Invite'}
            backgroundColor={Colors.BLUE}
            textStyle={styles.bgWhite}
            onPress={() => this.props.onPressSaveInvites()}
          />
        ) : (
          <Button
            name={'Select'}
            backgroundColor={Colors.BLUE}
            textStyle={styles.bgWhite}
            onPress={() => this.props.onPressSaveInvites()}
          />
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    usersByType: state.UserReducer.usersByType,
    usersByTypePaginatedObj: state.UserReducer.usersByTypePaginatedObj,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(InviteFriends);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
    paddingVertical: Platform.OS == 'ios' ? 30 : 0
  },
  bgWhite: {
    color: Colors.WHITE,
  },
  usersListContainer: {
    marginTop: 20,
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    justifyContent: 'center',

  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
    alignSelf: 'center'
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  name: {
    // flex: 1,
    paddingHorizontal: 15,
    fontSize: 19,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  role: {
    paddingHorizontal: 15,
    fontSize: 12,
    color: Colors.GRAY_3,
  },
  checkunCheckImage: {
    height: 25,
    width: 25,
  },
});
