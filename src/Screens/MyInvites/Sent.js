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
import { check_box_checked, check_box_un_check, dummy } from '../../Assets';
import { Button, Header, SearchBar, Text } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import NotificationByUserMiddleware from '../../Store/Middleware/NotificationByUserMiddleware';
import PlayerRequestApproveMiddleware from '../../Store/Middleware/PlayerRequestApproveMiddleware';
import BookingMidleware from '../../Store/Middleware/BookingMiddleware';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';

class MySentInvites extends Component {
    state = {
        loader: false,
        searchText: '',
        invitationListCopy: [],
    };

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.setState({ loader: true })
            this.props
                .getInvitationSentByUser()
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        })
    }

    componentWillUnmount() {
        if (this.unsubscribe)
            this.unsubscribe()
    }


    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { invitation_by_user } = this.props;
            this.props
                .getInvitationSentByUser(invitation_by_user.next_page_url, '')
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };


    renderLoaderMoreButton = () => {
        const { invitation_by_user } = this.props;
        const { loader } = this.state;
        return invitation_by_user.next_page_url ? (
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

    onPressNotification = item => {
        console.log('onPressNotification=>', item);
        if (item.content_type == 'appointment_modify') {
            // Get One Appointment and update Appointmnet List[]
            this.props
                .getOneCoachBooking({ booking_id: item.content_id })
                .then(data => {
                    this.props.navigation.navigate('AppointmentDetail', {
                        appointment: data[0],
                        isComeFromNotification: true,
                    });
                });
        }
    };

    getStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending"
                break;
            case "accept":
                return "Accepted"
                break;
            case "reject":
                return "Rejected"
                break;
            case "cancelled":
                return "Cancelled"
                break;
            default:
                break;
        }
    }

    renderClassesList = item => {
        return (
            <TouchableOpacity
                style={[styles.userContainer]}
                onPress={() => this.onPressNotification(item)}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: item?.profile_image ? img_url + item?.profile_image : dummyImage }}
                        style={styles.avatarImage}
                    // resizeMode={'contain'}
                    />
                    <View style={styles.flex1}>
                        <View style={styles.inviteRecipientNameContainer}>
                            {/* <Text style={styles.inviteRecipientName}>You</Text> */}
                            <Text style={{ ...styles.fontSize16, marginHorizontal: 0 }}>{item.title}</Text>
                            <Text style={styles.inviteRecipientName}>
                                {item.content_type}
                            </Text>
                        </View>
                        <Text style={{ marginStart: 0, fontSize: 16, fontWeight: "bold" }}>
                            {this.getStatus(item.content_action)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    onRefreshEclass = () => {
        this.setState({ loader: true }, () => {
            this.props
                .getInvitationSentByUser(undefined)
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };
    // onChangeSearchText = text => {
    //   this.setState({ loader: true }, () => {
    //     console.log(this.state.searchText, text, 'TEXT====>');
    //     this.props
    //       .getInvitationSentByUser(undefined)
    //       .then(() => this.setState({ loader: false }))
    //       .catch(() => this.setState({ loader: false }));
    //   });
    // };


    PlayerRequestApprove = item => {
        let { invitationListCopy } = this.state;

        invitationListCopy = this.props.invitation_by_user_list;
        let index = invitationListCopy.findIndex(val => val.id === item.id);

        let updateItem = {
            ...item,
            content_action: 'accept',
        };

        invitationListCopy.splice(index, 1, updateItem);
        this.setState({ invitationListCopy });

        this.props.playerRequestApprove({
            id: item.id,
            cid: item.content_id,
            type: item.content_type,
            action: 'accept',
        })
        // setTimeout(() => {
        //   this.onRefreshEclass();
        // }, 5000);
        // console.warn("Accept", item);
    };

    PlayerRequestReject = item => {
        let { invitationListCopy } = this.state;

        invitationListCopy = this.props.invitation_by_user_list;
        let index = invitationListCopy.findIndex(val => val.id === item.id);

        let updateItem = {
            ...item,
            content_action: 'reject',
        };

        invitationListCopy.splice(index, 1, updateItem);
        this.setState({ invitationListCopy });

        this.props.playerRequestApprove({
            id: item.id,
            cid: item.content_id,
            type: item.content_type,
            action: 'reject',
        })
        // this.onRefreshEclass()
        // setTimeout(() => {
        //   this.onRefreshEclass();
        // }, 5000)
    };

    renderNotifications = ({ item }) => (
        (
            <View
                style={{
                    flexDirection: 'row',
                    marginVertical: 12,
                }}>
                <View
                    style={{
                        marginRight: 12,
                        width: 14,
                        height: 14,
                        borderRadius: 100,
                        marginTop: 6,
                        backgroundColor: !item.isRead ? Colors.BLUE : Colors.GRAY_1,
                    }}
                />

                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>{item.title}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            style={{ color: Colors.BLACK, fontSize: 12, paddingVertical: 3 }}>
                            {item.time}
                        </Text>

                        {item?.following_status == 'pending' ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    marginVertical: 4,
                                }}>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        backgroundColor: Colors.BLUE,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: Colors.WHITE,
                                            fontWeight: 'bold',
                                        }}>
                                        Accept
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        marginHorizontal: 5,
                                        backgroundColor: Colors.GRAY_2,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                        }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        )
    );

    render() {
        const { getInvitationSentByUser, invitation_by_user_list, loader } = this.props;

        return (
            <View style={styles.container}>

                {/* <SearchBar onChangeText={this.onChangeSearchText} /> */}
                {this.state.loader ? (
                    <ActivityIndicator
                        size={'large'}
                        color={Colors.BLUE}
                        style={styles.loadMoreContentContainer}
                    />
                ) : null}

                {invitation_by_user_list && invitation_by_user_list?.length ? (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={loader}
                                onRefresh={this.onRefreshEclass}
                            />
                        }
                        // data={[1, 1, 1, 1, 1]}
                        style={styles.usersListContainer}
                        data={invitation_by_user_list}
                        renderItem={({ item, index }) => this.renderClassesList(item)}
                        ListFooterComponent={this.renderLoaderMoreButton()}
                    />
                ) : null}

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        role: state.Auth.role,
        user: state.Auth.user,
        invitation_by_user: state.NotificationByUserReducer.invitation_sent_by_user,
        invitation_by_user_list: state.NotificationByUserReducer.invitation_sent_by_user_list,
    };
};
const mapsDispatchToProps = dispatch => {
    return {
        getInvitationSentByUser: (payload) =>
            dispatch(NotificationByUserMiddleware.getSentInvitationByUser(payload)),
        playerRequestApprove: payload => dispatch(PlayerRequestApproveMiddleware.playerRequestApprove(payload)),
        getOneCoachBooking: payload =>
            dispatch(BookingMidleware.getOneCoachBooking(payload)),
        joinCoachLeague: payload =>
            dispatch(UserMiddleware.joinCoachLeague(payload)),
    };
};
export default connect(mapStateToProps, mapsDispatchToProps)(MySentInvites);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    bgWhite: {
        color: Colors.WHITE,
    },
    usersListContainer: {
        marginTop: 20,
        flex: 1
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
    },
    avatarImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 100,
    },
    name: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 19,
        color: Colors.GRAY_3,
        fontWeight: 'bold',
    },
    checkunCheckImage: {
        height: 25,
        width: 25,
    },
    flexRow: { flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10 },
    actionBtnLeft: {
        width: 80,
        height: 40,
        marginRight: 3,
    },
    actionBtnRight: {
        width: 80,
        height: 40,
        marginLeft: 3,
    },
    colorWhite: {
        fontSize: 12,
        color: Colors.WHITE,
    },
    fontSize16: {
        fontSize: 16,
    },
    inviteRecipientNameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    inviteRecipientName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    flex1: {
        flex: 1,
    },
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: Colors.BLUE,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
    },
    loadMoreText: {
        color: Colors.WHITE,
        fontWeight: '500',
        fontSize: 16,
        alignSelf: 'center'
    },

    flex1: { flex: 1 },
    loadMoreContentContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 100,
        marginVertical: 20,
    },
});

// export default MyInvites;
