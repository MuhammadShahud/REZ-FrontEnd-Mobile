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
import { Header, SearchBar, Text, Loader, Tag } from '../../Components';
import { Colors } from '../../Styles';
import { img_url } from '../../Store/Apis';
import { connect } from 'react-redux';
import PackagesMiddleware from '../../Store/Middleware/PackagesMiddleware'
import { dummyImage } from '../../Config';


class index extends Component {
    state = {
        loading: true,
        refreshing: false,
        isSelectedId: 2,
        loader: false
    };
    componentDidMount() {
        this.props.getContract({ id: this.props.user.id })
        this.props.getPackages({ id: this.props.user.id })
        this.props.getPasses({ id: this.props.user.id })

    }

    onRefreshEclass = () => {
        this.setState({ refreshing: true }, () => {
            switch (this.state.isSelectedId) {
                case 1:
                    this.props
                        .getContract({ id: this.props.user.id })
                        .then(data => { this.setState({ loading: false, refreshing: false }) })
                        .catch(error => { this.setState({ loading: false, refreshing: false }) })

                    break;
                case 2:
                    this.props
                        .getPackages({ id: this.props.user.id })
                        .then(data => { this.setState({ loading: false, refreshing: false }) })
                        .catch(error => { this.setState({ loading: false, refreshing: false }) })

                    break;
                case 3:
                    this.props
                        .getPasses({ id: this.props.user.id })
                        .then(data => { this.setState({ loading: false, refreshing: false }) })
                        .catch(error => { this.setState({ loading: false, refreshing: false }) })

                    break;
                default:
                    break;
            }

        });
    };

    delete = (type, id) => {
        switch (type) {
            case 'package':
                this.setState({ loader: true })
                this.props.deletePackage({ id })
                    .then(() => { alert("Package Deleted Successfully."), this.setState({ loader: false }) })
                    .catch(() => this.setState({ loader: false }))
                break;
            case 'pass':
                this.setState({ loader: true })
                this.props.deletePass({ id })
                    .then(() => { alert("Pass Deleted Successfully."), this.setState({ loader: false }) })
                    .catch(() => this.setState({ loader: false }))
                break;
            case 'contract':
                this.setState({ loader: true })
                this.props.deleteContract({ id })
                    .then(() => { alert("Contract Deleted Successfully."), this.setState({ loader: false }) })
                    .catch(() => this.setState({ loader: false }))
                break;

            default:
                break;
        }
    }

    renderContractList = ({ item, index }) => {
        return (
            <View activeOpacity={0.7} style={styles.userItemContainer}>

                <View style={styles.contractContainer}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>{item.name}</Text>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.delete('contract', item?.id)}>
                            <Image source={bin_black} style={{ resizeMode: 'contain', width: 20, height: 20, tintColor: Colors.BLACK }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ width: '55%', padding: 10 }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 12, marginBottom: 10 }}
                                numberOfLines={6}
                            > {item.description != null ? item.description : "No Description"}
                            </Text>

                            <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>{" No. Of Passes " + item.no_of_passes}</Text>
                            {/* <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>Training Passes 6</Text> */}

                        </View>

                        <View style={{ width: '45%', paddingTop: 10 }}>
                            <View style={styles.validContainer}>
                                <Text style={{ fontSize: 12, paddingHorizontal: 10, alignSelf: 'center' }}>{"Validity " + item.validity}</Text>
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', color: Colors.WHITE }}>{"$" + item.price}</Text>
                            </View>


                            <View style={styles.renewContainer}>
                                <Text style={{ fontSize: 15, alignSelf: 'center', color: Colors.WHITE }}>{"Renewable : " + item.is_renewable.toUpperCase()}</Text>
                            </View>

                        </View>


                    </View>
                </View>


            </View>
        );
    };

    renderPackageList = ({ item, index }) => {
        return (
            <View activeOpacity={0.7} style={styles.userItemContainer}>

                <View style={[styles.contractContainer, { height: 200 }]}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>{item.name}</Text>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.delete('package', item?.id)}>
                            <Image source={bin_black} style={{ resizeMode: 'contain', width: 20, height: 20, tintColor: Colors.BLACK }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ width: '55%', padding: 10 }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 12, marginBottom: 10 }}
                                numberOfLines={6}
                            >
                                {item.description != null ? item.description : "No Description"}
                            </Text>



                        </View>

                        <View style={{ width: '45%', paddingTop: 10 }}>
                            <View style={styles.validContainer}>
                                <Text style={{ fontSize: 12, paddingHorizontal: 10, alignSelf: 'center' }}>{"Validity " + item.validity}</Text>
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', color: Colors.WHITE }}>{"$" + item.price}</Text>
                            </View>


                        </View>


                    </View>
                </View>


            </View>
        );
    };

    renderPassesList = ({ item, index }) => {
        return (
            <View activeOpacity={0.7} style={styles.userItemContainer}>

                <View style={[styles.contractContainer, { height: 150 }]}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>{item.name}</Text>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.delete('pass', item?.id)}>
                            <Image source={bin_black} style={{ resizeMode: 'contain', width: 20, height: 20, tintColor: Colors.BLACK }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row' }}>

                        <View style={{ width: '55%', padding: 10 }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 12, marginBottom: 10 }}
                                numberOfLines={4}
                            > {item.description != null ? item.description : "No Description"}
                            </Text>
                            {item.visits != undefined ?
                                <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>{"Total Visits " + item.visits}</Text>
                                : null}
                        </View>

                        <View style={{ width: '45%', paddingTop: 10 }}>


                            <View style={styles.renewContainer}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', color: Colors.WHITE }}>{"$" + item.price}</Text>
                            </View>

                        </View>


                    </View>
                </View>


            </View>
        );
    };

    addbtnAction = () => {
        this.state.isSelectedId == 1 ?
            this.props.navigation.navigate('CreateContract') :
            this.state.isSelectedId == 2 ?
                this.props.navigation.navigate('CreatePackage') :
                this.props.navigation.navigate('CreatePasses');
    }

    render() {
        let Contracts = this.props.getcontacts;
        let packages = this.props.getpackages;
        let passes = this.props.getpasses;
        return (
            <View style={styles.container}>
                <Header
                    title={'Packages'}
                    isShowLeftIcon={true}
                    navigation={this.props.navigation}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                    <Tag
                        // containerStyle={{ width: 150 }}
                        key={1}
                        isActive={this.state.isSelectedId == 1}
                        text={'Contracts'}
                        onPress={() => this.setState({ isSelectedId: 1 })}
                    />
                    <Tag
                        // containerStyle={{ width: 150 }}
                        key={2}
                        isActive={this.state.isSelectedId == 2}
                        text={'Packages'}
                        onPress={() => this.setState({ isSelectedId: 2 })}
                    />
                    <Tag
                        // containerStyle={{ width: 150 }}
                        key={3}
                        isActive={this.state.isSelectedId == 3}
                        text={'Passes'}
                        onPress={() => this.setState({ isSelectedId: 3 })}
                    />
                </View>


                {Contracts && this.state.isSelectedId == 1 ? (
                    <FlatList
                        style={styles.flex1}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefreshEclass}
                            />}
                        data={
                            Contracts
                        }
                        renderItem={this.renderContractList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                <Text>Contract Not Found</Text>
                            </View>

                        }
                    // onEndReachedThreshold={0.3}
                    // onEndReached={this.onEndReached}
                    />
                ) :
                    packages && this.state.isSelectedId == 2 ? (
                        <FlatList
                            style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEclass}
                                />}
                            data={
                                packages
                            }
                            renderItem={this.renderPackageList}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={() =>

                                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                    <Text>Package Not Found</Text>
                                </View>

                            }
                        // onEndReachedThreshold={0.3}
                        // onEndReached={this.onEndReached}
                        />
                    ) : passes && this.state.isSelectedId == 3 ? <FlatList
                        style={styles.flex1}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefreshEclass}
                            />}
                        data={
                            passes
                        }
                        renderItem={this.renderPassesList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                <Text>Passes Not Found</Text>
                            </View>

                        }
                    // onEndReachedThreshold={0.3}
                    // onEndReached={this.onEndReached}
                    /> : <View style={{ paddingVertical: 12 }}>
                        <ActivityIndicator size={'large'} color={Colors.GREEN} />
                    </View>}


                {/* Fab Button */}
                <TouchableOpacity
                    onPress={() => this.addbtnAction()}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={28} color={Colors.WHITE} />
                </TouchableOpacity>
                <Loader loader={this.state.loader} />

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.Auth.user,
        role: state.Auth.role,
        getcontacts: state.PackagesReducer.Contracts,
        getpackages: state.PackagesReducer.Packages,
        getpasses: state.PackagesReducer.Passes,
    };
};

const mapsDispatchToProps = dispatch => {
    return {
        getContract: payload => dispatch(PackagesMiddleware.getAllContracts(payload)),
        getPackages: payload => dispatch(PackagesMiddleware.getAllPackages(payload)),
        getPasses: payload => dispatch(PackagesMiddleware.getAllPasses(payload)),
        deletePass: payload => dispatch(PackagesMiddleware.deletePass(payload)),
        deletePackage: payload => dispatch(PackagesMiddleware.deletePackage(payload)),
        deleteContract: payload => dispatch(PackagesMiddleware.deleteContract(payload)),

    };
};

export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    contractContainer: {
        backgroundColor: Colors.GREEN,
        width: '100%',
        height: 220,
        borderRadius: 20,
        marginVertical: 10
    },
    headingContainer: {
        backgroundColor: Colors.WHITE,
        width: '100%',
        height: 35,
        marginTop: 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    heading: {
        fontSize: 20,
        marginHorizontal: 10,
        fontWeight: '900',
        color: Colors.GREEN
    },
    validContainer: {
        backgroundColor: Colors.WHITE,
        width: 85,
        height: 35,
        alignSelf: 'flex-end',
        borderTopStartRadius: 20,
        borderBottomStartRadius: 20,
        justifyContent: 'center',
    },

    priceContainer: {
        backgroundColor: Colors.BLUE,
        width: 95,
        height: 40,
        alignSelf: 'flex-end',
        marginVertical: 10,
        borderTopStartRadius: 20,
        borderBottomStartRadius: 20,
        justifyContent: 'center'
    },
    renewContainer: {
        borderColor: Colors.WHITE,
        borderWidth: 1.5,
        width: '95%',
        height: 30,
        marginVertical: 10,
        borderRadius: 20,
        justifyContent: 'center'
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
