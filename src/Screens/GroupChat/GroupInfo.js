import React, { Component } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
    FlatList
} from 'react-native';
import {
    check_blue,
    close,
    upload,
    dummy,
    editIcon,
    bin_black,
    plus_white

} from '../../Assets';
import { Button, Header, Loader, Text, TextInput, Tag } from '../../Components';
import { Colors } from '../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import { connect } from 'react-redux';
import { InviteFriends } from '..';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import { dummyImage, OpenImagePicker } from '../../Config';
import { img_url } from '../../Store/Apis';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';


class GroupInfo extends Component {
    state = {
        image: '',
        members: [],
        description: '',
        title: '',
        loader: false,
        isEdit: false,
        isDes: false,
        isShowInviteFriendModal: false,
        selectedUsersIDs: [],
    };

    componentDidMount() {
        this.props.getUsersByType({ role: 'all' });

        let item = this.props.route?.params?.Detail;

        this.setState({
            selectedUsersIDs: [...item.members],
            description: item.description,
            title: item.name,
        })

        let member = this.state.members;
        for (const [i, val] of item.members.entries()) {
            member.push(val.id)
        }
        this.setState({ members: member });
    }

    updategroup = () => {
        let groupid = this.props.route.params?.Detail?.id
        let {
            description,
            title,
            members,
            image,
        } = this.state;

        console.warn(this.state.title);
        if (
            !title ||
            !description ||
            members.length == 0
        ) {

            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            this.setState({ loader: true });
            this.props
                .update({
                    group_id: groupid,
                    image: image,
                    name: title,
                    description: description,
                    members: members
                })
                .then(data => {
                    this.sheetRef.snapTo(0);
                    this.setState({ loader: false });
                })
                .catch(error => {
                    this.setState({ loader: false });
                });
        }
    };

    uploadProductImage = () => {
        OpenImagePicker(img => {
            let uri_script, name, imgObj;
            uri_script = img.path.split('/');
            name = uri_script[uri_script.length - 1];
            imgObj = {
                name,
                uri: img.path,
                size: img.size,
                type: img.mime,
            };
            this.setState({ image: imgObj })

        });


    };


    renderContent = () => {
        return (
            <View style={styles.confirmationSheetContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.sheetRef.snapTo(2);
                        this.props.navigation.goBack();
                    }}>
                    <Image
                        source={close}
                        style={styles.closeImage}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
                <View style={styles.sheetBody}>
                    <Image
                        source={check_blue}
                        style={styles.checkImage}
                        resizeMode={'contain'}
                    />
                    <Text style={styles.sheetHeading}>Group Updated </Text>
                    <Text style={styles.subHeading}>Successfully !!!</Text>
                </View>
            </View>
        );
    };


    onPressInvites = () => {
        this.setState({ isShowInviteFriendModal: true });
    };

    onPressSaveInvites = () => {
        let Membercount = this.state.selectedUsersIDs?.length;
        this.setState({ isShowInviteFriendModal: false });
        this.setState({ placeholder: Membercount + " Members Selected" })
    };


    onPressUser = item => {
        let selectedUsersIDsCopy = this.state.selectedUsersIDs;
        selectedUsersIDsCopy.push(item);
        this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
        let member = this.state.members;
        member.push(item.id)
        this.setState({ members: member });
    };

    removeUserFromSelectedUserIds = item => {
        let selectedUsersIDsCopy = this.state.selectedUsersIDs;
        let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
        selectedUsersIDsCopy.splice(foundIndex, 1);
        this.setState({ selectedUsersIDs: selectedUsersIDsCopy });

        let member = this.state.members;
        let Index = member.findIndex(x => x == item.id);
        member.splice(Index, 1);
        this.setState({ members: member });




    };

    renderInviteFriendsModal = () => {
        return (
            <Modal
                visible={this.state.isShowInviteFriendModal}
                style={{}}
                animationType={'slide'}>
                <InviteFriends
                    title={'Members'}
                    role={'all'}
                    onPressSaveInvites={this.onPressSaveInvites}
                    selectedUsersIDs={this.state.selectedUsersIDs}
                    onPressUser={this.onPressUser}
                    removeUserFromSelectedUserIds={this.removeUserFromSelectedUserIds}
                    navigation={this.props.navigation}
                    onPressBack={() => this.setState({ isShowInviteFriendModal: false })}
                />
            </Modal>
        );
    };


    deletemember = (id, index) => {
        let groupid = this.props.route.params?.Detail?.id
        let members = this.state.members;
        members.splice(index, 1)
        let selectedmember = this.state.selectedUsersIDs
        selectedmember.splice(index, 1)
        this.setState({ members: members, selectedUsersIDs: selectedmember })
        if (id != undefined)
            this.props.deleteMember({ user_id: id, group_id: groupid })
    }

    leaveGroup = () => {
        this.setState(({ loader: true }))
        let groupid = this.props.route.params?.Detail?.id
        console.warn(groupid);

        this.props.leaveGroup({ id: groupid })
            .then(data => { this.setState(({ loader: false })); this.props.navigation.goBack() })
            .catch(error => this.setState({ loader: false }))

    }

    deleteGroup = () => {
        this.setState(({ loader: true }))
        let groupid = this.props.route.params?.Detail?.id
        this.props.deleteGroup({ id: groupid })
            .then(data => { this.setState(({ loader: false })); this.props.navigation.goBack() })
            .catch(error => this.setState({ loader: false }))

    }
    render() {
        let groupDetails = this.props.route?.params?.Detail;
        let userdetail = this.props.user
        return (
            <>
                <View style={styles.container}>
                    <Header
                        isShowLeftIcon
                        navigation={this.props.navigation}
                        title={'Group'}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                        <View style={styles.imagecontainer}>
                            <Image
                                source={{ uri: this.state.image?.uri ? this.state.image?.uri : groupDetails.image != null ? img_url + groupDetails.image : dummyImage }}
                                style={styles.GroupImage}
                            />
                            {groupDetails.owner.id === userdetail.id ?
                                <TouchableOpacity style={styles.edit} onPress={this.uploadProductImage}>
                                    <Image style={{ width: 15, height: 15, tintColor: Colors.WHITE }} source={editIcon} resizeMode={'contain'} />
                                </TouchableOpacity> : null}
                        </View>
                        {!this.state.isEdit ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={styles.groupname}> {groupDetails.name} </Text>
                                {groupDetails.owner.id === userdetail.id ?
                                    <TouchableOpacity style={{ width: 20, height: 20, justifyContent: 'center', justifyContent: 'center' }} onPress={() => this.setState({ isEdit: !this.state.isEdit })}>
                                        <Image style={{ width: 15, height: 15, tintColor: Colors.GRAY_3 }} resizeMode={'contain'} source={editIcon} />
                                    </TouchableOpacity> : null}
                            </View> :
                            <View style={styles.inputContainer}>
                                <TextInput
                                    defaultValue={groupDetails.name}
                                    placeholder={'Group Name'}
                                    onChangeText={text => this.setState({ title: text })}
                                />
                            </View>}

                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={styles.heading}> Group Description </Text>

                                {groupDetails.owner.id === userdetail.id ?
                                    <TouchableOpacity style={{ width: 20, height: 20, alignSelf: "center", justifyContent: 'center' }} onPress={() => this.setState({ isDes: !this.state.isDes })}>
                                        <Image style={{ width: 15, height: 15, tintColor: Colors.GRAY_3 }} resizeMode={'contain'} source={editIcon} />
                                    </TouchableOpacity> : null}
                            </View>
                            {!this.state.isDes ?
                                <Text style={{ fontSize: 14, color: Colors.GRAY_3, textAlign: 'center' }}>{groupDetails.description}</Text>
                                :
                                <TextInput
                                    defaultValue={groupDetails.description}
                                    multiline
                                    numberOfLines={3}
                                    style={{
                                        height: 100,
                                        textAlignVertical: 'top',
                                        padding: 10,
                                        fontSize: 16,
                                        marginVertical: 5,
                                    }}
                                    onChangeText={text => this.setState({ title: text })}
                                />
                            }
                        </View>

                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={styles.heading}> Group Members </Text>

                                {groupDetails.owner.id === userdetail.id ?
                                    <TouchableOpacity style={{ width: 20, height: 20, alignSelf: "center", justifyContent: 'center' }} onPress={() => this.setState({ isShowInviteFriendModal: !this.state.isShowInviteFriendModal })}>
                                        <Image style={{ width: 15, height: 15, tintColor: Colors.GRAY_3 }} resizeMode={'contain'} source={plus_white} />
                                    </TouchableOpacity> : null}
                            </View>
                            <FlatList
                                style={styles.membersContainer}
                                showsVerticalScrollIndicator={false}
                                data={this.state.selectedUsersIDs}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                        <Image
                                            source={{ uri: item.image != null ? img_url + item.image : item.profile_image != null ? img_url + item.profile_image : dummyImage }}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 100,
                                                marginRight: 4,
                                            }}
                                        />
                                        <Text style={[styles.heading, { width: 70, fontSize: 15 }]}>{item.name != null ? item.name : item.username}</Text>
                                        <Text style={{ width: 100, fontSize: 12 }}>{item.phone != null ? item.phone : "000-000-0000"}</Text>
                                        {groupDetails.owner.id === userdetail.id ?
                                            <TouchableOpacity onPress={() => this.deletemember(item.id, index)}>
                                                <Image style={styles.deleteIcon} source={bin_black} resizeMode={'contain'} />
                                            </TouchableOpacity>
                                            : null}
                                    </View>
                                )}
                            />
                        </View>
                        {groupDetails.owner.id === userdetail.id ?
                            <Button
                                onPress={this.updategroup}
                                btnStyle={styles.mv20}
                                name={'Update'}
                                loading={this.state.loader}
                                backgroundColor={Colors.BLUE}
                                textStyle={styles.cWhite}
                            /> : null}

                        {groupDetails.owner.id != userdetail.id ?
                            <Button
                                onPress={this.leaveGroup}
                                btnStyle={styles.mv20}
                                name={'Leave Group'}
                                loading={this.state.loader}
                                backgroundColor={Colors.BLUE}
                                textStyle={styles.cWhite}
                            />
                            :
                            <Button
                                onPress={this.deleteGroup}
                                btnStyle={styles.mv20}
                                name={'Delete Group'}
                                loading={this.state.loader}
                                backgroundColor={Colors.BLUE}
                                textStyle={styles.cWhite}
                            />
                        }


                        {/* Loader */}
                        <Loader loader={this.state.loader} />

                    </ScrollView>
                </View>

                <BottomSheet
                    ref={ref => (this.sheetRef = ref)}
                    initialSnap={1}
                    snapPoints={[280, -200, 0]}
                    borderRadius={10}
                    renderContent={this.renderContent}
                />

                {this.renderInviteFriendsModal()}

            </>
        );
    }
}

const mapstateToProps = state => ({
    role: state.Auth.role,
    user: state.Auth.user,
});

const mapDispatchToProps = dispatch => ({
    deleteMember: payload => dispatch(ChatMiddleware.deletGroupMember(payload)),
    update: payload => dispatch(ChatMiddleware.updateGroupInfo(payload)),
    leaveGroup: payload => dispatch(ChatMiddleware.leaveGroup(payload)),
    deleteGroup: payload => dispatch(ChatMiddleware.deleteGroup(payload)),
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),

});

export default connect(mapstateToProps, mapDispatchToProps)(GroupInfo);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    inputContainer: {
        marginVertical: 10,
    },
    inputLabel: {
        color: Colors.GRAY_1,
    },
    inputDescription: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    mv20: {
        marginVertical: 5,
    },
    cWhite: {
        color: Colors.WHITE,
    },
    dropDownBtnText: {
        textAlign: 'left',
        color: Colors.GRAY_1,
        fontSize: 16,
    },
    btnStyle: {
        backgroundColor: Colors.GRAY_4,
        width: '100%',
        marginTop: 5,
        borderRadius: 10,
    },
    w20: {
        width: 20,
    },
    flexRow: {
        flexDirection: 'row',
    },
    inputTime: {
        flex: 1,
        marginTop: 10,
    },
    marginLeft5: {
        marginLeft: 5,
    },
    marginRight5: {
        marginRight: 5,
    },
    confirmationSheetContainer: {
        backgroundColor: Colors.BLUE_LIGHT,
        height: 280,
        paddingHorizontal: 35,
        paddingTop: 20,
    },
    closeImage: {
        width: 14,
        height: 14,
    },
    sheetBody: {
        marginVertical: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkImage: {
        width: 40,
        height: 40,
    },
    sheetHeading: {
        fontSize: 18,
        color: Colors.GRAY_3,
        paddingVertical: 5,
    },
    subHeading: {
        fontSize: 22,
        color: Colors.GRAY_3,
        fontWeight: '500',
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK,
        marginRight: 10,
        textAlign: 'center',
        marginVertical: 10
    },
    GroupImage: {
        width: 150,
        height: 150,
        borderRadius: 300
    },
    imagecontainer: {
        alignItems: 'center',
        width: '50%',
        height: 160,
        alignSelf: 'center'
    },
    edit: {
        backgroundColor: Colors.BLUE,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        alignSelf: 'flex-end',
        marginTop: -40
    },
    groupname: {
        fontSize: 16,
        color: Colors.GRAY_3,
        marginRight: 5,
        marginBottom: 10
    },
    section: {
        width: '100%',
        alignItems: 'center'
    },
    deleteIcon: {
        width: 15, height: 15, tintColor: Colors.GRAY_3
    },
    membersContainer: {
        height: 200
    }
});
