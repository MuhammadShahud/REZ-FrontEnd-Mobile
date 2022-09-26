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
    calendar_gray,
    check_blue,
    close,
    dropdownGreyIcon,
    dropdownIcon,
    upload,
} from '../../../Assets';
import { Button, Header, Loader, Text, TextInput, Tag } from '../../../Components';
import { Colors } from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import { connect } from 'react-redux';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware';
import { InviteFriends } from '../../';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import { OpenImagePicker } from '../../../Config';

class AddSubRoom extends Component {
    state = {
        RoomTitle: '',
        discription: '',
        parent_id: '',
        image: [],
        Staffs: [],
        loader: false,
        isUsed: true,
        isNew: false,
        isShowInviteFriendModal: false,
        selectedUsersIDs: [],
        staffplaceholder: 'Room Assigned (Staff Name)',

    };

    componentDidMount() {
        this.props.getUsersByType({ role: 'staff' });
        let id = this.props.route.params.room_id;
        this.setState({ parent_id: id })
    }


    UploadRoom = () => {
        let {
            RoomTitle,
            discription,
            parent_id,
            image,
            Staffs,
        } = this.state;

        if (
            !RoomTitle ||
            !discription ||
            image.length == 0 ||
            !parent_id ||
            Staffs.length == 0
        ) {

            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            this.setState({ loader: true });
            this.props
                .storeSubRoom({
                    RoomTitle,
                    discription,
                    parent_id,
                    image,
                    Staffs,
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
        }, true);


    };

    createimageObj = imgs => {
        let uri_script, name, imgObj, imagearray;
        if (imgs.length > 0) {
            for (const [i, img] of imgs.entries()) {
                uri_script = img.path.split('/');
                name = uri_script[uri_script.length - 1];
                imgObj = {
                    name,
                    uri: img.path,
                    size: img.size,
                    type: img.mime,
                };
                this.setState({ image: [...this.state.image, imgObj] })
            }
        } else {
            uri_script = imgs.path.split('/');
            name = uri_script[uri_script.length - 1];
            imgObj = {
                name,
                uri: imgs.path,
                size: imgs.size,
                type: imgs.mime,
            };
            this.setState({ image: [...this.state.image, imgObj] })
        }

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
                    <Text style={styles.sheetHeading}>Room Created </Text>
                    <Text style={styles.subHeading}>Successfully !!!</Text>
                </View>
            </View>
        );
    };

    onPressInvites = () => {
        this.setState({ isShowInviteFriendModal: true });
    };

    onPressSaveInvites = () => {
        let staffcount = this.state.selectedUsersIDs?.length;
        this.setState({ isShowInviteFriendModal: false });
        this.setState({ staffplaceholder: staffcount + " Staff Selected" })
    };


    onPressUser = item => {
        let selectedUsersIDsCopy = this.state.selectedUsersIDs;
        selectedUsersIDsCopy.push(item);
        this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
        let staff = this.state.Staffs;
        staff.push(item.id)
        this.setState({ Staffs: staff });
    };

    removeUserFromSelectedUserIds = item => {
        let selectedUsersIDsCopy = this.state.selectedUsersIDs;
        let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
        selectedUsersIDsCopy.splice(foundIndex, 1);
        this.setState({ selectedUsersIDs: selectedUsersIDsCopy });

        let staff = this.state.Staffs;
        let Index = staff.findIndex(x => x == item.id);
        staff.splice(Index, 1);
        this.setState({ Staffs: staff });




    };

    renderInviteFriendsModal = () => {
        return (
            <Modal
                visible={this.state.isShowInviteFriendModal}
                style={{}}
                animationType={'slide'}>
                <InviteFriends
                    title={'Staff'}
                    role={'staff'}
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

        let Stafflist = this.props.user.staffInfo.map(item => {
            return item?.username;
        });

        return (
            <>
                <View style={styles.container}>
                    <Header
                        isShowLeftIcon
                        navigation={this.props.navigation}
                        title={'Create Sub Room'}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                // value={this.state.RoomTitle}
                                placeholder={'Sub Room Name'}
                                onChangeText={text => this.setState({ RoomTitle: text })}
                            />
                        </View>

                        <View>
                            {/* <Text style={styles.inputLabel}>Upload Image</Text> */}
                            <TouchableOpacity onPress={() => this.setState({ isShowInviteFriendModal: true })}>
                                <TextInput
                                    editable={false}
                                    placeholder={this.state.staffplaceholder}
                                    endIcon={dropdownGreyIcon}
                                />
                            </TouchableOpacity>
                        </View>





                        <View style={{ width: '100%', marginTop: 10 }}>
                            {/* <Text style={{ color: Colors.GRAY_1 }}>Description</Text> */}
                            <TextInput
                                // value={this.state.discription}
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
                            />
                        </View>



                        <View style={styles.inputContainer}>
                            {this.state.image?.length > 0 ? (
                                <FlatList
                                    // style={styles.flex1}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.image}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (<>
                                        <Image
                                            source={{ uri: item?.uri }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 12,
                                                elevation: 3,
                                                marginRight: 4,
                                            }}
                                        />
                                    </>
                                    )}
                                />

                            ) : (
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
                            )}
                        </View>

                        <Button
                            onPress={this.UploadRoom}
                            btnStyle={styles.mv20}
                            name={'Create Sub Room'}
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
    storeSubRoom: payload =>
        dispatch(RoomMiddleware.StoreSubRoom(payload)),
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
});

export default connect(mapstateToProps, mapDispatchToProps)(AddSubRoom);

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
