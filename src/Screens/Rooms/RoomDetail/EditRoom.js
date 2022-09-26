import React, { Component } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
    calendar_gray,
    check_blue,
    close,
    dropdownGreyIcon,
    dropdownIcon,
    upload,
    bin_black,
} from '../../../Assets';
import { Button, Header, Loader, Text, TextInput, Tag } from '../../../Components';
import { Colors } from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware'
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware'
import { OpenImagePicker } from '../../../Config';
import { img_url } from '../../../Store/Apis';


class EditRoom extends Component {
    state = {
        RoomTitle: '',
        discription: '',
        sportType: undefined,
        type: '',
        image: [],
        roomimages: [],
        ArrayImage: [],
        ImageArray: [],
        loader: false,
    };

    componentDidMount() {
        // this.props.ProductCategories();
        this.props.getSportTypes();

        let { item } = this.props.route.params

        console.warn(item);
        this.setState({
            RoomTitle: item.name,
            discription: item.description,
            sportType: item.type,
            type: item.type_id,
            roomimages: [...item.images],
            ArrayImage: [...item.images],
            ImageArray: [],
            loader: false,
        })
    }

    UpdateRoom = () => {
        let { item } = this.props.route.params

        // console.warn(this.state);

        let {
            RoomTitle,
            type,
            discription,
            image,
        } = this.state;

        if (
            !RoomTitle ||
            !discription ||
            !type
            // !image
        ) {

            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            this.setState({ loader: true });
            this.props
                .UpdateRoom({
                    id: item.id,
                    RoomTitle,
                    discription,
                    type,
                    image,
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
        let uri_script, name, imgObj;

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
                this.setState({ ArrayImage: [...this.state.ArrayImage, imgObj] })
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
            this.setState({ ArrayImage: [...this.state.ArrayImage, imgObj] })
        }

    }

    renderContent = () => {
        return (
            <View style={styles.confirmationSheetContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.sheetRef.snapTo(1);
                        if (this.props.role === 'store') {
                            this.props.navigation.navigate('StoreBottomTabs');
                        } else {
                            this.props.navigation.goBack();
                        }
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
                    <Text style={styles.sheetHeading}>Room Updated </Text>
                    <Text style={styles.subHeading}>Successfully !!!</Text>
                </View>
            </View>
        );
    };

    removeimage = (item, index) => {
        let images = this.state.ArrayImage;
        images.splice(index, 1)
        this.setState({ ArrayImage: images })
        if (item.id != undefined)
            this.props.deleteRoomImage({ id: item.id, room_id: this.props.route.params.room_id })
    }

    render() {
        let SportsTypes = this.props.sportTypes.map(item => {
            return item?.sportname;
        });

        return (
            <>
                <View style={styles.container}>
                    <Header
                        isShowLeftIcon
                        navigation={this.props.navigation}
                        title={this.state.RoomTitle}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={this.state.RoomTitle}
                                placeholder={'Room Name'}
                                onChangeText={text => this.setState({ RoomTitle: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <SelectDropdown
                                data={SportsTypes}
                                defaultButtonText={this.state.sportType}
                                defaultValue={this.state.sportType}
                                dropdownIconPosition="right"
                                renderDropdownIcon={() => {
                                    return (
                                        <Image
                                            resizeMode="contain"
                                            source={dropdownGreyIcon}
                                            style={{ width: 15 }}
                                        />
                                    );
                                }}
                                buttonTextStyle={styles.dropDownBtnText}
                                buttonStyle={styles.btnStyle}
                                onSelect={(val, index) => {
                                    {
                                        this.setState({ type: this.props.sportTypes[index].id }),
                                            console.warn(this.props.sportTypes[index].sportname);
                                    }
                                }}
                            />
                        </View>




                        <View style={{ width: '100%', marginTop: 10 }}>
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
                            {this.state.ArrayImage?.length > 0 ? (<>
                                <TouchableOpacity onPress={this.uploadProductImage} style={{ marginBottom: 10 }}>
                                    <TextInput
                                        editable={false}
                                        placeholder={'Choose Image'}
                                        endIcon={upload}
                                    />
                                </TouchableOpacity>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.ArrayImage}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => (<>
                                        <Image
                                            source={{ uri: item?.image ? img_url + item?.image : item?.uri }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 12,
                                                elevation: 3,
                                                marginRight: 4,
                                                marginBottom: 5
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => this.removeimage(item, index)}
                                            style={{ elevation: 3, backgroundColor: Colors.WHITE, height: 30, width: 30, position: "absolute", bottom: 5, right: 4, alignSelf: "center", alignItems: "center", borderBottomRightRadius: 12, borderTopLeftRadius: 10 }}
                                        >
                                            <Image
                                                source={bin_black}
                                                style={{ width: 20, height: 20, marginTop: 5 }}
                                                resizeMode={'contain'}
                                            />
                                        </TouchableOpacity>
                                    </>
                                    )}
                                />
                            </>

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
                            onPress={this.UpdateRoom}
                            btnStyle={styles.mv20}
                            name={'Update Room'}
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
            </>
        );
    }
}

const mapstateToProps = state => ({
    role: state.Auth.role,
    sportTypes: state.Auth.sportTypes,
});

const mapDispatchToProps = dispatch => ({
    UpdateRoom: payload =>
        dispatch(RoomMiddleware.UpdateRoom(payload)),
    deleteRoomImage: payload =>
        dispatch(RoomMiddleware.deleteRoomImage(payload)),
    getSportTypes: () => dispatch(AuthMiddleware.getSportTypes()),
});

export default connect(mapstateToProps, mapDispatchToProps)(EditRoom);

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
