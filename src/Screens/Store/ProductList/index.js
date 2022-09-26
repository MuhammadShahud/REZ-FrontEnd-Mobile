import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {bin_black, editIcon, redShirt} from '../../../Assets';
import {Header, SearchBar, Text, Loader} from '../../../Components';
import {Colors} from '../../../Styles';
import {img_url} from '../../../Store/Apis';
import {connect} from 'react-redux';
import StoreMiddleware from '../../../Store/Middleware/StoreMiddleware';
import StoreAction from '../../../Store/Actions/StoreAction';

class ProductList extends Component {
  state = {
    searchText: '',
    next_page_url: null,
    searchedProductList: [],
    searchLoading: false,
    loading: true,
  };

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      let productCategoryId = this.props.route.params?.productCategoryId;
      let producttype = this.props.route.params?.type;
      
      if (productCategoryId || producttype) {
        console.warn("type-----",producttype , productCategoryId);
        this.props
          .getAllProductsWithoutCategory({
            productCategoryId,
            type:producttype,
            name: this.state.searchText,
          })
          .then(data => {
            if (data) this.setState({loading: false});
          })
          .catch(err => {
            this.setState({loading: false});
          });
      } else {
        this.props
          .getAllProductsWithoutCategory({
            productCategoryId: '',
            type:'',
            name: '',
          })
          .then(data => {
            if (data) this.setState({loading: false});
          })
          .catch(err => {
            this.setState({loading: false});
          });
      }
    });
  }

  renderProductList = ({item, index}) => {
    let productUploadedDate = new Date(item.created_at)
      .toDateString()
      .slice(4, 15);

    // console.warn(typeof item.user_id);

    return (
      <View activeOpacity={0.7} style={styles.userItemContainer}>
        <Image
          source={{uri: img_url + item.product_img}}
          style={styles.avatarImage}
        />

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', {item})
          }
          style={styles.userNameContainer}>
          <Text style={styles.name}>{item.product_name}</Text>
          <Text style={styles.userName}>Date: {productUploadedDate}</Text>
          <Text style={styles.userName}>${item.product_price}</Text>
        </TouchableOpacity>

        {this.props.user.id == item.user_id ? (
          <View style={{justifyContent: 'space-evenly'}}>
            <TouchableOpacity
              style={{padding: 6}}
              onPress={() =>
                this.props.navigation.navigate('EditProduct', {item})
              }>
              <Image
                source={editIcon}
                style={styles.actionIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.productDelete(item, index)}
              style={{padding: 6}}>
              <Image
                source={bin_black}
                style={styles.actionIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  productDelete = item => {
    console.warn(item.id);
    this.props.deleteStoreProduct({id: item.id, product: item});
  };

  onEndReached = () => {
    console.warn('onEndReached');
  };

  searchProducts = text => {
    this.setState({searchLoading: true});
    let productCategoryId = this.props.route.params?.productCategoryId;
    let producttype = this.props.route.params?.type;

    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      if (text) {
        this.props
          .getAllProductsWithoutCategory({
            productCategoryId,
            type:producttype,
            name: text,
          })
          .then(data => {
            if (data) this.setState({searchLoading: false});
          })
          .catch(err => {
            this.setState({searchLoading: false});
          });
      } else {
        this.props
          .getAllProductsWithoutCategory({
            productCategoryId,
            producttype,
            name: text,
          })
          .then(data => {
            if (data) this.setState({searchLoading: false});
          })
          .catch(err => {
            this.setState({searchLoading: false});
          });
      }
    }, 500);
  };

  render() {
    let productCategoryId = this.props.route.params?.productCategoryId;

    // let StoreProductList = this.props.getStoreProducts?.data.find(item => {
    //   if (item.id === productCategoryId) {
    //     return item;
    //   }
    // });

    // let storeAllProdutList = this.props.getStoreProducts.data
    //   .map(x => x.products)
    //   .flat();
    console.log('getStoreProducts=>', this.props.getStoreProducts);
    return (
      <View style={styles.container}>
        <Header
          title={'Product List'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <SearchBar
          onChangeText={text => this.searchProducts(text, productCategoryId)}
        />

        {this.state.searchLoading && !this.state.loading ? (
          <View style={{paddingVertical: 12}}>
            <ActivityIndicator size={'small'} color={Colors.GREEN} />
          </View>
        ) : null}

        {!this.state.loading && !this.state.searchLoading ? (
          <FlatList
            style={styles.flex1}
            showsVerticalScrollIndicator={false}
            data={
              // this.state.searchedProductList.length > 0
              //   ? this.state.searchedProductList
              //   :
              this.props.productsList
              // productCategoryId ? StoreProductList?.products : storeAllProdutList
            }
            renderItem={this.renderProductList}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() =>
              !this.state.searchedProductList.length ? (
                <View style={{paddingVertical: 20, alignItems: 'center'}}>
                  <Text>Product Not Found</Text>
                </View>
              ) : null
            }
            // onEndReachedThreshold={0.3}
            // onEndReached={this.onEndReached}
          />
        ) : null}

        <Loader loader={this.state.loading} />

        {/* Fab Button */}
        {this.props.role == 'store' ||
        this.props.role == 'facility' ||
        this.props.role == 'coach' ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AddProduct')}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    role: state.Auth.role,
    getStoreProducts: state.StoreReducer.storeProducts,
    productsList: state.StoreReducer.productsList,
  };
};

const mapsDispatchToProps = dispatch => {
  return {
    updateProductList: payload =>
      dispatch(StoreAction.getStoreProducts(payload)),
    getAllProductsWithoutCategory: payload =>
      dispatch(StoreMiddleware.getProductsWithoutCategory(payload)),
    deleteStoreProduct: payload =>
      dispatch(StoreMiddleware.deleteProduct(payload)),
  };
};

export default connect(mapStateToProps, mapsDispatchToProps)(ProductList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  buyNowContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  buyNowText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: {flex: 1},
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_LIGHT,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 2,
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
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  followContainer: {
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  plusImage: {
    width: 13,
    height: 13,
  },
  actionIcon: {
    width: 20,
    height: 20,
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
