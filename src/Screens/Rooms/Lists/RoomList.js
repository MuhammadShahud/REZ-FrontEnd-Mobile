import React, { Component } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { bin_black, editIcon, redShirt } from '../../../Assets';
import { Header, SearchBar, Text, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import { img_url } from '../../../Store/Apis';
import { connect } from 'react-redux';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware'
import { dummyImage } from '../../../Config';


class RoomList extends Component {
    state = {
        loading: true,
        refreshing: false,
    };
    componentDidMount() {
        this.props
            .getRoom()
            .then(data => {
                if (data) {
                    this.setState({ loading: false, refreshing: false });
                }
            })
            .catch(err => {
                this.setState({ loading: false, refreshing: false });
            });
    }

    onRefreshEclass = () => {
        this.setState({ refreshing: true }, () => {
            this.props
                .getRoom()
                .then(data => {
                    if (data) {
                        this.setState({ loading: false, refreshing: false });
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, refreshing: false });
                });

        });
    };

    renderRoomList = ({ item, index }) => {
        let productUploadedDate = new Date(item.created_at)
            .toDateString()
            .slice(4, 15);

        // console.warn(typeof item.user_id);

        return (
            <View activeOpacity={0.7} style={styles.userItemContainer}>
                <TouchableOpacity style={styles.userItemContainers}
                    onPress={() =>
                        this.props.navigation.navigate('RoomDetails', { item })
                    }
                >
                    <Image
                        source={{ uri: item?.images.length > 0 ? img_url + item.images[0].image : dummyImage }}
                        style={styles.avatarImage}
                    />

                    <View
                        style={styles.userNameContainer}>
                        <Text style={styles.name}>{item?.name}</Text>
                    </View>

                </TouchableOpacity>
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity
                        //   style={{padding: 6}}
                        onPress={() =>
                            this.props.navigation.navigate('EditRoom', { item })
                        }
                    >
                        <Image
                            source={editIcon}
                            style={styles.actionIcon}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.RoomDelete(item)}
                    >
                        <Image
                            source={bin_black}
                            style={styles.actionIcon}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        );
    };

    RoomDelete = item => {
        console.warn(item.id);
        this.props.
            DeleteRoom({ id: item.id, product: item })
            .then(data => {
                if (data) {
                    this.setState({ loading: false, refreshing: false });
                    this.props.getRoom()
                }
            })
            .catch(err => {
                this.setState({ loading: false, refreshing: false });
            });
    };

    render() {

        let Rooms = this.props.getRooms;
        return (
            <View style={styles.container}>
                <Header
                    title={'Rooms'}
                    isShowLeftIcon={true}
                    navigation={this.props.navigation}
                />

                {this.state.loading ? (
                    <View style={{ paddingVertical: 12 }}>
                        <ActivityIndicator size={'large'} color={Colors.GREEN} />
                    </View>
                ) : null}

                {!this.state.loading ? (
                    <FlatList
                        style={styles.flex1}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefreshEclass}
                            />}
                        data={
                            Rooms
                        }
                        renderItem={this.renderRoomList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                <Text>Rooms Not Found</Text>
                            </View>

                        }
                    // onEndReachedThreshold={0.3}
                    // onEndReached={this.onEndReached}
                    />
                ) : null}


                {/* Fab Button */}
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('AddRoom')}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={28} color={Colors.WHITE} />
                </TouchableOpacity>

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.Auth.user,
        role: state.Auth.role,
        getRooms: state.RoomReducer.Rooms,
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        getRoom: () => dispatch(RoomMiddleware.GetAllRooms()),
        DeleteRoom: payload =>
            dispatch(RoomMiddleware.deleteRoom(payload)),
    };
};

export default connect(mapStateToProps, mapsDispatchToProps)(RoomList);

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

    flex1: {
        flex: 1, marginTop: 10, marginBottom: 40,
    },
    userItemContainer: {
        alignSelf: 'center',
        paddingVertical: 14,
        flexDirection: 'row',
        // backgroundColor: Colors.BLUE_LIGHT,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
    },
    userItemContainers: {
        width: '90%',
        flexDirection: 'row',
        // backgroundColor: Colors.BLUE_LIGHT,
        // marginVertical: 5,
        // paddingHorizontal: 10,
        // borderRadius: 3,
    },
    avatarImage: {
        width: 70,
        height: 70,
        borderRadius: 100,
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
    actionIcon: {
        width: 15,
        height: 15,
        marginHorizontal: 2,
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
