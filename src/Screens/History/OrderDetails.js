import React, { Component } from 'react';
import {
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Header } from '../../Components';
import { img_url } from '../../Store/Apis';
import { Colors } from '../../Styles';

export default class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this?.props?.route?.params?.items ? this?.props?.route?.params?.items : [],
            refreshing: false,
        };
    }
    _renderItem = (item) => (
        console.warn("item:", item?.item),
        <View
            activeOpacity={0.7}
            style={styles.userItemContainer}>
            <Image source={{ uri: img_url + item?.item?.product_img }} style={styles.avatarImage} />
            <View style={styles.userNameContainer}>
                <Text style={styles.name}>{item?.item?.product_name}</Text>
                <Text style={styles.userName}>Size: {item?.item?.size}</Text>
                <Text style={styles.userName}>color: {item?.item?.color}</Text>
                <Text style={styles.userName}>Quantity: {item?.item?.quantity}</Text>
                <Text style={styles.userName}>Category: {item?.item?.category}</Text>
                <Text style={styles.userName}>Description:</Text>
                <Text style={styles.description}>{item?.item?.product_description}</Text>
            </View>
            <Text style={styles.price}>${item?.item?.total}</Text>
        </View >
    );
    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    title={this?.props?.route?.params?.orderNo}
                    isShowLeftIcon={true}
                />
                <FlatList
                    data={this.state.data}
                    style={styles.pt15}
                    ListHeaderComponentStyle={{
                        marginBottom: 10,
                        marginTop: 10,
                    }}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    ListEmptyComponent={() =>
                        <View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: 12,
                                    color: Colors.black,
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>
                                items not found
                            </Text>
                        </View>}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 15,
    },
    pt15: {
        paddingTop: 15,
    },
    bgImage: {
        height: 180,
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    mv5: {
        marginVertical: 5,
    },
    avatarImage: {
        width: 65,
        height: 65,
        borderRadius: 2,
    },
    postContainer: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    postContentContainer: {
        height: 80,
        backgroundColor: Colors.BLUE_LIGHT,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    postTitle: {
        color: Colors.GRAY_3,
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    postDate: {
        marginBottom: 10,
        color: Colors.GRAY_3,
        fontSize: 12,
    },
    userItemContainer: {
        alignSelf: 'center',
        paddingVertical: 14,
        flexDirection: 'row',
        backgroundColor: Colors.BLUE_LIGHT,
        marginVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        // alignItems: 'center',
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
        paddingRight: 10,
    },
    userName: {
        color: Colors.GRAY_3,
        fontSize: 12,
    },
    description: {
        color: Colors.GRAY_3,
        fontSize: 12,
        width: '120%',
    },
    followContainer: {
        justifyContent: 'center',
        justifyContent: 'space-evenly',
    },
    plusImage: {
        width: 13,
        height: 13,
    },
    price: {
        color: Colors.BLACK,
        fontSize: 18,
        fontWeight: 'bold',
    },
});