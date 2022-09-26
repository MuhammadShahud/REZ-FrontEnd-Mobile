import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import BottomSheet from 'reanimated-bottom-sheet';
import Entypo from 'react-native-vector-icons/Entypo';
import { FilterSheetItem, Header, Loader, TextInput } from '../../Components';
import { Colors } from '../../Styles';
import {
  clothes,
  filterIcon,
  hat,
  hats,
  kit,
  redShirt,
  searchIcon,
  yellowShirt,
} from '../../Assets';
import { connect } from 'react-redux';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import { img_url } from '../../Store/Apis';

export class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      searching: false,
      refreshing: false,
      isOpen: false,
    };
  }

  componentDidMount() {
    let role = this.props.role;
    if (
      role == 'store' ||
      role == 'facility' ||
      role == 'coach' ||
      role == 'staff'
    ) {
      this.props
        .getStoreProductList({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
    } else {
      this.props
        .getAllStoreProducts({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
      this.props
        .getAllUsedProducts({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
    }
  }


  renderProducts = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', { item })
          }
          activeOpacity={0.7}
          style={styles.productItemContainer}>
          <Image
            source={{ uri: img_url + item.product_img }}
            style={{ width: 160, height: 160 }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 6,
            }}>
            <Text style={styles.productName}>{item.product_name}</Text>
            {/* <View style={styles.ratingContainer}>
            <AirbnbRating
              size={10}
              reviewSize={25}
              showRating={false}
              //   onFinishRating={this.ratingCompleted}
              style={{paddingVertical: 10}}
            />
          </View> */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.BLACK,
              }}>
              ${item.product_price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderUsedProducts = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', { item })
          }
          activeOpacity={0.7}
          style={styles.productItemContainer}>
          <Image
            source={{ uri: img_url + item.product_img }}
            style={{ width: 160, height: 160 }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 6,
            }}>
            <Text style={styles.productName}>{item.product_name}</Text>
            {/* <View style={styles.ratingContainer}>
            <AirbnbRating
              size={10}
              reviewSize={25}
              showRating={false}
              //   onFinishRating={this.ratingCompleted}
              style={{paddingVertical: 10}}
            />
          </View> */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.BLACK,
              }}>
              ${item.product_price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderBackDrop = () => (
    <Animated.View
      style={{
        opacity: this.state.opacity,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
        activeOpacity={1}
      />
    </Animated.View>
  );

  searchProducts = text => {
    this.setState({ searching: true });

    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      if (text) {
        this.props
          .getAllStoreProducts({ text })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });
        this.props
          .getAllUsedProducts({ text })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });
      } else {
        this.props
          .getAllStoreProducts({ text: '' })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });

        this.props
          .getAllUsedProducts({ text: '' })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });
      }
    }, 500);
  };

  searchStoreProducts = text => {
    this.setState({ searching: true });

    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      if (text) {
        this.props
          .getStoreProductList({ text })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });
      } else {
        this.props
          .getStoreProductList({ text: '' })
          .then(data => {
            if (data) {
              this.setState({ searching: false });
            }
          })
          .catch(err => {
            this.setState({ searching: false });
          });
      }
    }, 500);
  };

  onRefresh = () => {
    let role = this.props.role;
    this.setState({ refreshing: true });

    if (role == 'store' || role == 'facility' || role == 'coach' || role == 'staff') {
      this.props
        .getStoreProductList({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
    } else {
      this.props
        .getAllStoreProducts({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
      this.props
        .getAllUsedProducts({ text: '' })
        .then(data => {
          if (data) {
            this.setState({ loading: false, refreshing: false });
          }
        })
        .catch(err => {
          this.setState({ loading: false, refreshing: false });
        });
    }
  };

  onOpen = () => {
    this.BottomSheet_ref.snapTo(2);
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.BottomSheet_ref.snapTo(0);
    this.setState({ isOpen: false });
  };
  isStaffhasPermission = () => {
    if (this.props.role === 'staff') {
      let storePermission = this.props.user?.permissions?.find(
        x => x.permission_type == 'store',
      )
        ? true
        : false;
      if (this.props.user?.facilityMembership && storePermission === true) {
        storePermission = true;
      } else {
        storePermission = false;
      }
      return storePermission;
    } else {
      return false;
    }
  };

  render() {
    let { height, width } = Dimensions.get('window');
    let storeProducts = this.props.getStoreProducts?.data;
    let usedProducts = this.props.getUsedProducts;

    let isEmpty = false;
    console.log('isStaffhasPermission=>', this.isStaffhasPermission());
    console.log(JSON.stringify(this.props.user));

    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 25 }}>
          <Header
            title="Store"
            isShowLeftIcon={false}
            navigation={this.props.navigation}
          />
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.imgContainer}>
            <Image source={searchIcon} style={{ width: 16, height: 16 }} />
          </View>

          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Search here"
              style={{ paddingHorizontal: 10 }}
              onChangeText={text =>
                this.props.role === 'store' ||
                  this.props.role === 'coach' ||
                  this.props.role === 'facility'
                  ? this.searchStoreProducts(text)
                  : this.searchProducts(text)
              }
            />
          </View>

          <TouchableOpacity onPress={this.onOpen} style={styles.imgContainer}>
            <Image source={filterIcon} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
        </View>

        {this.state.searching && !this.state.loading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator size={'small'} color={Colors.GREEN} />
          </View>
        ) : null}

        {!this.state.loading && !this.state.searching ? (
          <ScrollView>
            {storeProducts?.map(item => {
              let productCategoryindex = storeProducts.findIndex(
                val => val.id === item.id,
              );
              let products = storeProducts.filter(item => item.products.length);
              // item.products.length <= 0 ? (isEmpty = true) : null;
              return (
                <View>
                  <View style={styles.productHeaderContainer}>
                    <Text style={styles.title}>
                      {products[productCategoryindex]?.productcategory_name}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('ProductList', {
                          productCategoryindex,
                          productCategoryId:
                            products[productCategoryindex]?.products[0]
                              ?.category_id,
                          type: '',
                        })
                      }>
                      {products[productCategoryindex]?.products.length > 0 ? (
                        <Text style={{ color: Colors.BLACK }}>View all</Text>
                      ) : null}
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={products[productCategoryindex]?.products}
                    renderItem={this.renderProducts}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  // contentContainerStyle={{backgroundColor: Colors.WHITE}}
                  // ListEmptyComponent={() => {
                  //   !products.length ? (
                  // <View
                  //   style={{paddingVertical: 20, alignItems: 'center'}}>
                  //   <Text>Product Not Found</Text>
                  // </View>
                  //   ) : null;
                  // }}
                  />
                </View>
              );
            })}

            {/* Used Products */}

            <View>
              <View style={styles.productHeaderContainer}>
                {usedProducts?.data.length > 0 ?
                  <Text style={styles.title}>
                    {"Used Products"}
                  </Text> : null}
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProductList', {
                      productCategoryId: '',
                      type: 'old',
                    })
                  }>
                  {usedProducts?.data.length > 0 ? (
                    <Text style={{ color: Colors.BLACK }}>View all</Text>
                  ) : null}
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={usedProducts?.data}
                renderItem={this.renderUsedProducts}
                keyExtractor={(item, index) => index.toString()}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              // contentContainerStyle={{ backgroundColor: Colors.WHITE }}
              // ListEmptyComponent={() => {
              //     <View
              //       style={{ paddingVertical: 20, alignItems: 'center' }}>
              //       <Text>Product Not Found</Text>
              //     </View>

              // }}
              />
            </View>

          </ScrollView>
        ) : null}

        <BottomSheet
          ref={ref => (this.BottomSheet_ref = ref)}
          initialSnap={0}
          snapPoints={[0, height - 50, height / 1.7, 0]}
          renderContent={() => (
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.GRAY_2,
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}>
              <FilterSheetItem onClose={this.onClose} />
            </View>
          )}
        />

        {/* Fab button */}
        {this.props.role == 'store' ||
          this.props.role == 'facility' ||
          this.props.role == 'coach' ||
          this.isStaffhasPermission() ? (
          <TouchableOpacity
            onPress={() => {
              !this.props.user.membership &&
                this.isStaffhasPermission() === false
                ? this.props.navigation.navigate('MemberShip')
                : this.props.navigation.navigate('AddProduct');
            }}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
        ) : this.props.role === 'player' || this.props.role === 'parent' ?
          (
            <TouchableOpacity
              onPress={() =>

                this.props.navigation.navigate('AddProduct')
              }
              activeOpacity={0.7}
              style={styles.fabBtn}>
              <Entypo name="plus" size={28} color={Colors.WHITE} />
            </TouchableOpacity>
          ) : null}
        <Loader loader={this.state.loading} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    role: state.Auth.role,
    getStoreProducts: state.StoreReducer.storeProducts,
    getUsedProducts: state.StoreReducer.UsedProducts,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getStoreProductList: payload =>
      dispatch(StoreMiddleware.GetStoreProduts(payload)),
    getAllStoreProducts: payload =>
      dispatch(StoreMiddleware.getAllStoreProductsForUsers(payload)),

    getAllUsedProducts: payload =>
      dispatch(StoreMiddleware.getAllUsedProductsForUsers(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  searchContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.GRAY_4,
  },
  imgContainer: {
    flex: 0.1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  productHeaderContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: 'bold',
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
  filterSheetContainer: {
    borderWidth: 1,
    borderColor: Colors.GRAY_2,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  productItemContainer: {
    width: 160,
    marginVertical: 8,
    backgroundColor: Colors.GRAY_4,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginHorizontal: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 12,
    color: Colors.BLACK,
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
});
