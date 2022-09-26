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
import { bin_black, editIcon, redShirt } from '../../Assets';
import { Header, SearchBar, Text, Loader } from '../../Components';
import { Colors } from '../../Styles';
import { img_url } from '../../Store/Apis';
import { connect } from 'react-redux';
import { dummyImage } from '../../Config';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware';
import BlockButton from '../../Components/BlockButton';


class index extends Component {
    state = {
        loading: true,
        refreshing: false,
    };
    componentDidMount() {
        this.props.getblockUsers()
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
            this.props.getblockUsers()
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

    renderBlockList = ({ item, index }) => {

        return (
            <View activeOpacity={0.7} style={styles.userItemContainer}>
                <TouchableOpacity style={styles.userItemContainers}
                    onPress={() =>
                        this.props.navigation.navigate('RoomDetails', { item })
                    }
                >
                    <Image
                        source={{ uri: item?.profile_pic ? img_url + item?.profile_pic : dummyImage }}
                        style={styles.avatarImage}
                    />

                    <View
                        style={styles.userNameContainer}>
                        <Text style={styles.name}>{item?.username}</Text>
                    </View>

                </TouchableOpacity>
                <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                    <BlockButton user_id={item?.id} isBlock={true} mystyle={{ width: 100 }} />
                </View>

            </View>
        );
    };


    render() {
        const { getBlockList } = this.props

        return (
            <View style={styles.container}>
                <Header
                    title={'Block List'}
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
                            getBlockList
                        }
                        renderItem={this.renderBlockList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                <Text>Users not found</Text>
                            </View>

                        }
                    // onEndReachedThreshold={0.3}
                    // onEndReached={this.onEndReached}
                    />
                ) : null}

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        getBlockList: state.Auth.blockList,

    };
};

const mapsDispatchToProps = dispatch => {
    return {
        getblockUsers: () => dispatch(AuthMiddleware.getBlockList())
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
        width: '70%',
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
