import React, { Component } from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { yellowShirt, dummy } from '../../../Assets';
import { Header } from '../../../Components';
import { Colors } from '../../../Styles';
import PlayerRequestTeamMiddleware from '../../../Store/Middleware/PlayerRequestTeamMiddleware';
import TeamDetailsMiddleware from '../../../Store/Middleware/TeamDetailsMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../../Store/Apis';
import { dummyImage } from '../../../Config';

class TeamRoster extends Component {

    render() {
        // console.log('teamDetailsDataaaaaaaaaaa', this.props?.teamDetailsData)
        // console.log('teamDetailsDataaaaaaaaaaa', this.props.route.params)
        const details = this.props?.teamDetailsData
        let data = [1, 2, 3, 4]
        return (
            <View
                style={{ flex: 1, backgroundColor: Colors.WHITE, paddingHorizontal: 24 }}
            >
                <Header
                    title={'Team Roster'}
                    isShowLeftIcon={true}
                    navigation={this.props.navigation}
                />
                {details?.coach != null ?
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OthersProfile', { item: { id: details?.coach.user_id, username: details?.coach.name } })}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Image
                                source={{
                                    uri: details?.coach.image ? img_url + details?.coach.image : dummyImage,
                                }}
                                style={{ width: 90, height: 90, borderRadius: 10, marginVertical: 10 }}
                            />
                            <View style={styles.ph15}>

                                <Text style={styles.Teamname}>{details?.coach?.name}</Text>
                                <Text style={styles.Category}>{details?.coach?.email}</Text>
                                <Text style={styles.member}>{'Team Coach'}</Text>

                            </View>
                        </View>

                    </TouchableOpacity> : <View style={{ marginVertical: 20 }}>

                        <Text style={styles.Category}>Team doesn't have any coach yet</Text>

                    </View>}

                <View style={{ borderBottomWidth: 2, borderBottomColor: Colors.GRAY_2, width: '100%' }}></View>

                <FlatList
                    data={details?.members}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OthersProfile', { item: { id: item.user_id, username: item.name } })}>
                            <View style={styles.eventContainer}>
                                <Image
                                    source={{
                                        uri: item?.image ? img_url + item?.image : dummyImage,
                                    }} style={styles.avatarImage}
                                //   resizeMode={'contain'}
                                />
                                <View style={styles.ph15}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.Category}>{item.email}</Text>
                                    <Text style={styles.member}>{'Team Member'}</Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={{ marginVertical: 20 }}>

                            <Text style={styles.Category}>Team doesn't have any members yet</Text>

                        </View>}
                />


                <ScrollView showsVerticalScrollIndicator={false}>


                    {/* <View>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('OthersProfile', { item: details })}
                            style={{
                                // width: '45%',
                                paddingVertical: 12,
                                backgroundColor: Colors.BLUE,
                            }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: Colors.WHITE,
                                }}>
                                View Profile
                            </Text>
                        </TouchableOpacity>
                       
                    </View> */}

                    {/* <Text
                        style={{
                            paddingVertical: 8,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: Colors.BLACK,
                        }}>
                        {details?.username}
                    </Text>
                    <Text>{details?.sportname}</Text>

                    <Text style={{ paddingVertical: 15 }}>
                        {details?.description ? details?.description : 'No Team Description'}
                    </Text>

                    <Text>
                        Number Of Players:{' '}
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.BLACK }}>
                            {details?.totalplayer}
                        </Text>
                    </Text> */}

                    {/* <Text style={{paddingVertical: 8}}>
          Rank:{' '}
          <Text style={{fontSize: 16, fontWeight: 'bold', color: Colors.BLACK}}>
            07
          </Text>
        </Text> */}

                    {/* <Text>
                        Level:{' '}
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.BLACK }}>
                            {details?.level}
                        </Text>
                    </Text>
                    {details?.playerexistinteam ? (null) : (
                        <View>
                            {details?.playerrequesttoteam ? (
                                <TouchableOpacity
                                    onPress={() => this.PlayerRequestTeam(details)}
                                    // disabled
                                    style={{
                                        marginVertical: 20,
                                        paddingVertical: 12,
                                        backgroundColor: Colors.GREEN,
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 17,
                                            fontWeight: 'bold',
                                            color: Colors.WHITE,
                                        }}>
                                        Requested
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => this.PlayerRequestTeam(details)}
                                    style={{
                                        marginVertical: 20,
                                        paddingVertical: 12,
                                        backgroundColor: Colors.BLUE,
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 17,
                                            fontWeight: 'bold',
                                            color: Colors.WHITE,
                                        }}>
                                        Request
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )} */}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.Auth.user,
        teamDetailsData: state.TeamDetailsReducer.teamDetailsData,
        playerRequestTeamData: state.PlayerRequestTeamReducer.playerRequestTeamData,
    };
};
const mapsDispatchToProps = dispatch => {
    return {
        teamDetails: payload => dispatch(TeamDetailsMiddleware.teamDetails(payload)),
        playerRequestTeam: payload => dispatch(PlayerRequestTeamMiddleware.playerRequestTeam(payload)),

    };
};
export default connect(mapStateToProps, mapsDispatchToProps)(TeamRoster);
// export default index;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        elevation: 4,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    Teamname: {
        fontSize: 20,
        color: Colors.GRAY_3,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 19,
        color: Colors.GRAY_3,
        fontWeight: 'bold',
    },
    ph15: {
        paddingHorizontal: 15,
    },
    Category: {
        fontWeight: '500',
        color: Colors.GRAY_6,
    },
    member: {
        fontWeight: '500',
        fontSize: 12,
        color: Colors.GRAY_6,
    },
});

