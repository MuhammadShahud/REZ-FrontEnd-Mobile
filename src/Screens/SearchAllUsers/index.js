import React, { Component } from 'react';
import {
    FlatList,
    Image,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import {
    dummy,
    eye,
    filterIcon,
    map_marker,
    searchIcon,
    plus_white,
} from '../../Assets';
import { Header, TextInput, Text, SearchBar } from '../../Components';
import { Colors } from '../../Styles';
import FollowMiddleware from '../../Store/Middleware/FollowMiddleware';
import { connect } from 'react-redux';
import SearchAllUsersMiddleware from '../../Store/Middleware/SearchAllUsersMiddleware';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';



class index extends Component {
    state = {
        loader: true,
        searchText: '',
        followerSearchCopy:[],
    };

    componentDidMount() {
        this.props
            .getSearchUser()
            .then(() => this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { searchUser } = this.props;
            this.props
                .getSearchUser(searchUser.next_page_url, '')
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { searchUser } = this.props;
        const { loader } = this.state;
        return searchUser.next_page_url ? (
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

    onRefreshEclass = () => {
        this.setState({ loader: true }, () => {
            this.props
                .getSearchUser(undefined, this.state.searchText)
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };
    onChangeSearchText = text => {
        this.setState({ loader: true, searchText: text }, () => {
            console.log(this.state.searchText, text, 'TEXT====>');
            this.props
                .getSearchUser(undefined, text)
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };


    renderUsersList = item =>
    (

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('OthersProfile', { item })}
            activeOpacity={0.7} style={styles.userItemContainer}>

            <Image source={{
                uri: item?.profile_image
                    ? img_url + item?.profile_image
                    : dummyImage,
            }} style={styles.avatarImage} />
            <View style={styles.userNameContainer}>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.userName}>{item.role}</Text>
            </View>
            {/* {item.id !== this.props.user.id && item.id !== this.props.route.params.userItem.id ? ( */}
            <View style={styles.followContainer}>
                {item.isFollow ? (
                    <TouchableOpacity
                        onPress={() => this.FollowUser(item)}
                        style={styles.buyNowContainer}>
                        {/* <Image source={plus_white} style={styles.plusImage} /> */}
                        <Text style={styles.buyNowText}>Following</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => this.FollowUser(item)}
                        style={styles.buyNowContainer}>
                        <Image source={plus_white} style={styles.plusImage} />
                        <Text style={styles.buyNowText}>Follow</Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* ) : null } */}
        </TouchableOpacity>

    )

    FollowUser = (item) => {
        let followerSearchCopy = this.props.searchUser_list

        let index = followerSearchCopy.findIndex(val => val.id === item.id)

        if (!followerSearchCopy[index].isFollow) {
            let updateItem = { ...item, isFollow: true, }


            followerSearchCopy.splice(index, 1, updateItem)

        } else {
            let index = followerSearchCopy.findIndex(val => val.id === item.id)
            let updateItem = { ...item, isFollow: false, }

            followerSearchCopy.splice(index, 1, updateItem)

        }
        this.setState({ followerSearchCopy })
        this.props
            .followUser({ id: item.id })
    };

    render() {
        const { searchUser, searchUser_list, loader } = this.props;

        return (
            <View style={styles.container}>
                <Header
                    title={'All Users'}
                    isShowLeftIcon={true}
                    navigation={this.props.navigation}
                />
                <SearchBar onChangeText={this.onChangeSearchText} />
                {!searchUser ? (
                    <ActivityIndicator
                        size={'large'}
                        color={Colors.BLUE}
                        style={styles.loadMoreContentContainer}
                    />
                ) : null}
                {searchUser_list && searchUser_list?.length ? (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={loader}
                                onRefresh={this.onRefreshEclass}
                            />
                        }
                        style={styles.flex1}
                        showsVerticalScrollIndicator={false}
                        data={searchUser_list}
                        renderItem={({ item, index }) => this.renderUsersList(item)}
                        ListFooterComponent={this.renderLoaderMoreButton()}
                    />
                ) : null}

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.Auth.user,
        followUserData: state.FollowReducer.followUserData,

        searchUser: state.SearchAllUsersReducer.searchUser,
        searchUser_list: state.SearchAllUsersReducer.searchUser_list,
    };
};
const mapsDispatchToProps = dispatch => {
    return {
        followUser: payload => dispatch(FollowMiddleware.followUser(payload)),
        getSearchUser: (payload, searchText) =>
            dispatch(SearchAllUsersMiddleware.getSearchUser(payload, searchText)),


    };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    buyNowContainer: {
        paddingHorizontal: 10,
        backgroundColor: Colors.BLUE,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
    },
    buyNowText: {
        color: Colors.WHITE,
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 5,
    },

    flex1: { flex: 1 },
    userItemContainer: {
        alignSelf: 'center',
        paddingVertical: 14,
        flexDirection: 'row',
    },
    avatarImage: {
        width: 65,
        height: 65,
        borderRadius: 100,
    },
    userNameContainer: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        color: Colors.GRAY_3,
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
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: Colors.BLUE,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
    },
    loadMoreText: {
        color: Colors.WHITE,
        fontWeight: '500',
        fontSize: 16,
        marginLeft: 5,
    },

    flex1: { flex: 1 },
    loadMoreContentContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 100,
        marginVertical: 20,
    },
});
