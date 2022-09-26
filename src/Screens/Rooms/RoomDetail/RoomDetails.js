import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal
} from 'react-native';
import { Header, Button, Text, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import Swiper from 'react-native-swiper';
import { connect } from 'react-redux';
import { dummyImage } from '../../../Config';
import { img_url } from '../../../Store/Apis';


class RoomDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
           
        };
    }

    componentDidMount() {
        let { item } = this.props.route.params;
    }
    render() {
        let { item } = this.props.route.params;

        console.warn("Id " + item.images.length);

        return (
            <>
                <View style={styles.container}>
                    <View style={{ marginHorizontal: 20 }}>
                        <Header
                            title={item?.name}
                            isShowLeftIcon={true}
                            navigation={this.props.navigation}
                        />
                    </View>

                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.body}>



                            <View style={styles.Details}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', height:200 }}>
                                    {item.images.length > 0 ?
                                        <Swiper
                                            style={styles.wrapper}
                                            index={0}
                                            // showsButtons={true}
                                            autoplayTimeout={5}
                                            showsPagination={true}
                                            dotColor={Colors.BLUE_LIGHT}
                                            activeDotColor={Colors.BLUE}
                                            paginationStyle={{ top: '90%' }}
                                            loop={true}
                                            autoplay={true}>
                                            {item.images.map((v, key) => (
                                                <View style={styles.MainView} key={key}>
                                                    <Image key={v.id + key} source={{ uri: img_url + v.image }} style={styles.ImgView1} />
                                                </View>
                                            ))}
                                        </Swiper> :
                                        <View style={styles.wrapper}>
                                            <View style={styles.MainView}>
                                                <Image
                                                    source={{ uri: dummyImage }}

                                                    style={styles.imgPromo}
                                                />
                                            </View>
                                        </View>
                                    }
                                </View>
                                <View>
                                    <Text style={styles.Heading}>Basic Information</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.ShortHeading}>Room Name :</Text>
                                        <Text style={styles.ShortHeadingInner}> {item.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                        <Text style={styles.ShortHeading}>Sport Types :</Text>
                                        <Text style={styles.ShortHeadingInner}> {item.type}</Text>
                                    </View>
                                    <Text style={styles.ShortHeading}>Description :</Text>
                                    <Text style={styles.ShortHeadingInner}>{item.description}</Text>

                                    <Button

                                        onPress={() =>
                                            this.props.navigation.navigate('SubRoomList' ,{room_id : item.id})
                                        }
                                        btnStyle={styles.mv20}
                                        name={'Subroom'}
                                        loading={this.state.loader}
                                        backgroundColor={Colors.BLUE}
                                        textStyle={styles.cWhite}
                                    />

                                </View>


                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* <Loader loader={this.state.loading} /> */}
            </>
        );
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetails);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    body: {
        flex: 1,
        marginHorizontal: 20,
        // backgroundColor: 'pink',
        paddingBottom: 10,
    },

    imgPromo: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    DetailBody: {
        flex: 0.5,
    },
    mv20: {
        marginVertical: 20,
        width: '90%',
        alignSelf: 'center',
    },
    cWhite: {
        color: Colors.WHITE,
    },
    Heading: {
        fontSize: 18,
        color: Colors.BLACK,
        marginVertical: 15,
        fontWeight: 'bold',
    },
    ShortHeading: {
        fontSize: 14,
        color: Colors.GRAY_5,
        justifyContent: 'center',
        // backgroundColor:"#ccc",
        // marginHorizontal: 10,
        fontWeight: 'bold',
    },
    ShortHeadingInner: {
        fontSize: 14,
        color: Colors.GRAY_1,
        // marginHorizontal: 5,
        fontWeight: 'normal',
    },

    Details: {
        // flexDirection: 'row',

        justifyContent: 'space-evenly',
        marginVertical: 5,
    },
    ImgView1: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 12,
    },
    wrapper: {
        // width: '100%',
        // height: 180,

    },
    MainView: {
        width: '100%',
        height: '95%',
        borderRadius: 12,
        backgroundColor: Colors.GRAY_2,
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        marginVertical: 10,
    },

});
