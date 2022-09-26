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
} from '../../../Assets';
import { Button, Header, Loader, Text, TextInput, Tag } from '../../../Components';
import { Colors } from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import PackagesMiddleware from '../../../Store/Middleware/PackagesMiddleware'


import { OpenImagePicker } from '../../../Config';

class CreatePasses extends Component {
    state = {
        PassTitle: '',
        description: '',
        valid: '',
        validity: ['Yearly', 'Monthly', 'Weekly'],
        price: '',
        ScheduleType: '',
        visit: '',
        loader: false,
    };

    componentDidMount() {
        this.props.getScheduleTypes()


    }

    CreatePasses = () => {
        let {
            PassTitle,
            ScheduleType,
            description,
            price,
            visit
        } = this.state;

        if (
            !PassTitle ||
            !description ||
            !ScheduleType ||
            !price ||
            !visit
        ) {

            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            this.setState({ loader: true });
            this.props
                .createPass({
                    PassTitle,
                    ScheduleType,
                    description,
                    price,
                    id: this.props.user.id,
                    visit
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
                    <Text style={styles.sheetHeading}>Pass Created </Text>
                    <Text style={styles.subHeading}>Successfully !!!</Text>
                </View>
            </View>
        );
    };


    render() {
        let { scheduleTypes } = this.props

        return (
            <>
                <View style={styles.container}>
                    <Header
                        isShowLeftIcon
                        navigation={this.props.navigation}
                        title={'Create Pass'}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                // value={this.state.PassTitle}
                                placeholder={'Pass Name'}
                                onChangeText={text => this.setState({ PassTitle: text })}
                            />
                        </View>

                        <View style={{ width: '100%', marginTop: 10 }}>
                            {/* <Text style={{ color: Colors.GRAY_1 }}>Description</Text> */}
                            <TextInput
                                // value={this.state.description}
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
                                onChangeText={text => this.setState({ description: text })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <SelectDropdown
                                data={scheduleTypes}
                                defaultButtonText={"Schedule Type"}
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
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.title;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.title
                                }}
                                buttonTextStyle={styles.dropDownBtnText}
                                buttonStyle={styles.btnStyle}
                                onSelect={(selectedItem, index) => {
                                    this.setState({ ScheduleType: selectedItem.id });
                                }}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                // value={this.state.PassTitle}
                                placeholder={'Price'}
                                keyboardType={'numeric'}
                                onChangeText={text => this.setState({ price: text })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                // value={this.state.PassTitle}
                                placeholder={'Total Visits'}
                                keyboardType={'numeric'}
                                onChangeText={text => this.setState({ visit: text })}
                            />
                        </View>



                        <Button
                            onPress={this.CreatePasses}
                            btnStyle={styles.mv20}
                            name={'Create Pass'}
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
    user: state.Auth.user,
    role: state.Auth.role,
    scheduleTypes: state.ScheduleReducer.scheduleTypes,

});

const mapDispatchToProps = dispatch => ({
    getScheduleTypes: () => dispatch(ScheduleMiddleware.getScheduleTypes()),
    createPass: payload => dispatch(PackagesMiddleware.createPasses(payload)),


});

export default connect(mapstateToProps, mapDispatchToProps)(CreatePasses);

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
