import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import moment from 'moment';

import {dummy, plus_white, redShirt} from '../../Assets';
import {Header, SearchBar, Text} from '../../Components';
import {Colors} from '../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import EClassMiddleware from '../../Store/Middleware/EClassMiddleware';
import {img_url} from '../../Store/Apis';

class EClass extends Component {
  state = {
    loader: true,
    searchText: '',
  };
  componentDidMount() {
    this.props
      .getEClasses()
      .then(() => this.setState({loader: false}))
      .catch(() => this.setState({loader: false}));
  }

  onPressLoadMore = () => {
    this.setState({loader: true}, () => {
      const {e_class} = this.props;
      this.props
        .getEClasses(e_class.next_page_url, '')
        .then(() => this.setState({loader: false}))
        .catch(() => this.setState({loader: false}));
    });
  };

  renderLoaderMoreButton = () => {
    const {e_class} = this.props;
    const {loader} = this.state;
    return e_class.next_page_url ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={{width: 110, alignSelf: 'center', marginVertical: 13}}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  renderClassesList = item => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        style={styles.userItemContainer}
        onPress={() =>
          this.props.navigation.navigate('EClassDetails', {eclass: item})
        }>
        <Image
          source={{uri: img_url + item.file_path}}
          style={styles.avatarImage}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>{item.session_name}</Text>
          <Text style={styles.userName}>{`Date : ${moment(item.date).format('MM/DD/YYYY')}`}  </Text>
          <Text
            style={styles.userName}>{`Duration:  ${item.duration} mins`}</Text>
        </View>
        <Text style={styles.price}>{`$${item.price}`}</Text>
      </TouchableOpacity>
    );
  };

  onRefreshEclass = () => {
    this.setState({loader: true}, () => {
      this.props
        .getEClasses(undefined, this.state.searchText)
        .then(() => this.setState({loader: false}))
        .catch(() => this.setState({loader: false}));
    });
  };
  onChangeSearchText = text => {
    this.setState({loader: true, searchText: text}, () => {
      console.log(this.state.searchText, text, 'TEXT====>');
      this.props
        .getEClasses(undefined, text)
        .then(() => this.setState({loader: false}))
        .catch(() => this.setState({loader: false}));
    });
  };

  isStaffhasPermission = () => {
    if (this.props.role === 'staff') {
      const eClassPermission = this.props.user?.permissions?.find(
        x => x.permission_type == 'e_class',
      )
        ? true
        : false;
      return eClassPermission;
    } else {
      return false;
    }
  };

  render() {
    const {e_class, e_classes_list, loader} = this.props;

    console.log('ROLE=>', this.isStaffhasPermission());
    return (
      <View style={styles.container}>
        <Header
          title={'E-Classes'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <SearchBar onChangeText={this.onChangeSearchText} />
        {!e_class ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />
        ) : null}
        {e_classes_list && e_classes_list?.length ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            style={styles.flex1}
            showsVerticalScrollIndicator={false}
            data={e_classes_list}
            renderItem={({item, index}) => this.renderClassesList(item)}
            ListFooterComponent={this.renderLoaderMoreButton()}
          />
        ) : null}

        {/* Fab Button */}
        {this.props.role === 'coach' || this.props.role === 'facility' || this.isStaffhasPermission() ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AddEClass')}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    e_class: state.EClassReducer.e_class,
    e_classes_list: state.EClassReducer.e_classes_list,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getEClasses: (payload, searchText) =>
      dispatch(EClassMiddleware.getEClasses(payload, searchText)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(EClass);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    justifyContent:'center',

  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf:'center'
  },

  flex1: {flex: 1},
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 120,
    marginVertical: 20,
  },
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_LIGHT,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 2,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.BLACK,
    fontWeight: '500',
    fontSize: 18,
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  followContainer: {
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  plusImage: {
    width: 13,
    height: 13,
  },
  price: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
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
