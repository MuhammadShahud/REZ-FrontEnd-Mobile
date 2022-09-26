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
    dropdownGreyIcon,
    upload,
} from '../../Assets';
import { Button, Header, Loader, Text, TextInput, Tag } from '../../Components';
import { Colors } from '../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import { connect } from 'react-redux';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import { InviteFriends } from '../';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import { OpenImagePicker } from '../../Config';

class CreateGroup extends Component {
    state = {
        GroupTitle: '',
        discription: '',
        parent_id: '',
        image: '',
        members: [],
        loader: false,
        isUsed: true,
        isNew: false,
        isShowInviteFriendModal: false,
        selectedUsersIDs: [],
        placeholder: 'Add Members',

    };

    componentDidMount() {
        this.props.getUsersByType({ role: 'all' });
    }
    CreateGroup = () => {
        let {
            GroupTitle,
            discription,
            image,
            members,
        } = this.state;

        if (
            !GroupTitle ||
            !discription ||
            !image ||
            members.length == 0
        ) {

            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            this.setState({ loader: true });
            this.props
                .createGroup({
                    name: GroupTitle,
                    description: discription,
                    image,
                    members,
                })
                .then(data => {
                    this.setState({ loader: false });
                    this.sheetRef.snapTo(0);
                })
                .catch(error => {
                    this.setState({ loader: false });
                });
        }
    };

    uploadProductImage = () => {
        OpenImagePicker(img => {
            this.createimageObj(img);
        });


    };

    createimageObj = img => {
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


    }
    renderContent = () => {
        return (
            <View style={styles.confirmationSheetContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.sheetRef.snapTo(1);
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
                    <Text style={styles.sheetHeading}>Group Created </Text>
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



    render() {
        return (
            <>
                <View style={styles.container}>
                    <Header
                        isShowLeftIcon
                        navigation={this.props.navigation}
                        title={'Create Group'}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={this.state.GroupTitle}
                                placeholder={'Group Name'}
                                onChangeText={text => this.setState({ GroupTitle: text })}
                            />
                        </View>

                        <View>
                            {/* <Text style={styles.inputLabel}>Upload Image</Text> */}
                            <TouchableOpacity onPress={() => this.setState({ isShowInviteFriendModal: true })}>
                                <TextInput
                                    editable={false}
                                    placeholder={this.state.placeholder}
                                    endIcon={dropdownGreyIcon}
                                />
                            </TouchableOpacity>
                        </View>





                        <View style={{ width: '100%', marginTop: 10 }}>
                            {/* <Text style={{ color: Colors.GRAY_1 }}>Description</Text> */}
                            <TextInput
                                value={this.state.discription}
                                placeholder={'Description'}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor={Colors.GRAY_1}
                                style={{
                                    height: 100,
                                    textAlignVertical: 'top',
                                    padding: 10,
                                    fontSize: 16,
                                    marginVertical: 5,
                                    color: Colors.GRAY_1,
                                }}
                                onChangeText={text => this.setState({ discription: text })}
                            // value={this.state.address}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            {this.state.image?.uri ?
                                <Image
                                    source={{ uri: this.state.image?.uri }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 12,
                                        elevation: 3,
                                        marginRight: 4,
                                    }}
                                />
                                :
                                <View>
                                    {/* <Text style={styles.inputLabel}>Upload Image</Text> */}
                                    <TouchableOpacity onPress={this.uploadProductImage}>
                                        <TextInput
                                            editable={false}
                                            placeholder={'Choose Image'}
                                            endIcon={upload}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>

                        <Button
                            onPress={this.CreateGroup}
                            btnStyle={styles.mv20}
                            name={'Create Group'}
                            loading={this.state.loader}
                            backgroundColor={Colors.BLUE}
                            textStyle={styles.cWhite}
                        />

                        {/* Loader */}
                        <Loader loader={this.state.loader} />

                    </ScrollView>
                </View>

                <BottomSheet
                    ref={ref => (this.sheetRef = ref)}
                    initialSnap={1}
                    snapPoints={[280, -200]}
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
    createGroup: payload =>
        dispatch(ChatMiddleware.createGroup(payload)),
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
});

export default connect(mapstateToProps, mapDispatchToProps)(CreateGroup);

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
        marginVertical: 20,
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
});
