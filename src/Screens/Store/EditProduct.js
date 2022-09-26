import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import { connect } from 'react-redux';
import { Header, TextInput, Loader } from '../../Components';
import { img_url } from '../../Store/Apis';
import { Colors } from '../../Styles';
import { OpenImagePicker } from '../../Config';
import CheckBox from '@react-native-community/checkbox';

class EditProduct extends Component {
  constructor(props) {
    super(props);
    let { item } = props.route.params;
    console.warn("Type----" + item?.type);
    this.state = {
      productName: item?.product_name ? item?.product_name : '',
      productPrice: item?.product_price ? item?.product_price : '',
      productSizes: ['Small', 'Medium', 'Large'],
      productSize: item?.size ? item?.size : [],
      productColor: item?.color ? item?.color : '',
      productDescription: item?.product_description
        ? item?.product_description
        : '',
      image: null,
      loading: false,
      type: item?.type,
    };
  }

  updateProduct = () => {
    let { item } = this.props.route.params;
    let {
      productName,
      productPrice,
      productSize,
      productColor,
      productDescription,
      image,
      type,
    } = this.state;

    this.setState({ loading: true });

    this.props
      .updateStoreProduct({
        productName,
        productPrice,
        productSize,
        productColor,
        productDescription,
        category_id: item.category_id,
        productId: item.id,
        image: image?.uri ? image : item.product_img,
        type: item?.type,
      })
      .then(data => {
        if (data) {
          this.setState({ loading: false }, () => {
            Alert.alert('Success', 'Updated successfully', [
              {
                text: 'Ok',
                onPress: () => this.props.navigation.goBack(),
              },
            ]);
          });
        } else {
          this.setState({ loading: false });
        }
      }).catch(() => this.setState({ loading: false }));
  };

  uploadImage = () => {
    OpenImagePicker(img => {
      let uri_script = img.path.split('/');
      let name = uri_script[uri_script.length - 1];

      let imgObj = {
        name,
        uri: img.path,
        size: img.size,
        type: img.mime,
      };

      this.setState({ image: imgObj });
    });
  };

  unCheckSize = item => {
    let { productSize } = this.state;

    let selectedSizesCopy = [...productSize];
    let index = selectedSizesCopy.findIndex(val => val === item);
    selectedSizesCopy.splice(index, 1);
    this.setState({ productSize: selectedSizesCopy });
  };

  render() {
    let {
      productName,
      productPrice,
      productSize,
      productColor,
      productDescription,
      image,
    } = this.state;
    let { item } = this.props.route.params;

    console.warn(' ===', productSize);

    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <View style={{ paddingHorizontal: 25 }}>
          <Header
            title={'Edit Product'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>

        <ScrollView>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: image?.uri ? image?.uri : img_url + item.product_img,
              }}
              style={{ width: '100%', height: 300 }}
            />

            <TouchableOpacity
              onPress={this.uploadImage}
              style={{
                padding: 12,
                borderRadius: 100,
                backgroundColor: Colors.WHITE,
                position: 'absolute',
                right: 14,
                bottom: 14,
              }}>
              <MaterialCommunityIcons
                name="image-edit"
                size={25}
                color={Colors.BLACK}
              />
            </TouchableOpacity>
          </View>

          <View style={{ width: '90%', alignSelf: 'center', marginVertical: 14 }}>
            <Text>Product Name</Text>
            <TextInput
              value={productName}
              onChangeText={text => this.setState({ productName: text })}
              inputContainerStyle={{
                marginVertical: 12,
              }}
            />

            <Text>Product Price</Text>
            <TextInput
              value={productPrice}
              onChangeText={text => this.setState({ productPrice: text })}
              inputContainerStyle={{
                marginVertical: 12,
              }}
            />

            <Text>Product Size</Text>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical:5 }}>
              {this.state.productSizes.map((item, index) => {
                let isChecked = this.state.productSize?.some(
                  val => val === item,
                );
                return (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <CheckBox
                        onCheckColor={Colors.BLUE}
                        value={isChecked}
                        onValueChange={newValue => {
                          if (!isChecked) {
                            this.state.productSize.push(item);
                            this.setState({ productSize });
                          } else {
                            this.unCheckSize(item);
                          }
                        }}
                      />
                      <Text style={{marginLeft:5}}>{item}</Text>
                    </View>
                  </>
                );
              })}

              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  onCheckColor={Colors.BLUE}
                  value={this.state.productSize === 'small' ? true : false}
                  onValueChange={newValue =>
                    this.setState({productSize: 'small'})
                  }
                />
                <Text>Small</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={this.state.productSize === 'medium' ? true : false}
                  onValueChange={newValue =>
                    this.setState({productSize: 'medium'})
                  }
                />
                <Text>Medium</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={this.state.productSize === 'large' ? true : false}
                  onValueChange={newValue =>
                    this.setState({productSize: 'large'})
                  }
                />
                <Text>Large</Text>
              </View> */}
              {/* 
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  value={sizes === 'all'}
                  onValueChange={newValue => this.setState({sizes: 'all'})}
                />
                <Text>All</Text>
              </View> */}
            </View>

            <Text>Product Color</Text>
            <TextInput
              value={productColor}
              onChangeText={text => this.setState({ productColor: text })}
              inputContainerStyle={{
                marginVertical: 12,
              }}
            />

            <Text>Product Description</Text>
            <TextInput
              value={productDescription}
              onChangeText={text => this.setState({ productDescription: text })}
              inputContainerStyle={{
                flex: 1,
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
              style={{
                height: 100,
                textAlignVertical: 'top',
              }}
            />

            <TouchableOpacity
              onPress={this.updateProduct}
              style={styles.button}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Loader loader={this.state.loading} />
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  getStoreProducts: state.StoreReducer.storeProducts,
});

const mapDispatchtoProps = dispatch => ({
  updateStoreProduct: payload =>
    dispatch(StoreMiddleware.updateProduct(payload)),
});

export default connect(mapStatetoProps, mapDispatchtoProps)(EditProduct);

const styles = StyleSheet.create({
  imageContainer: {
    width: '90%',
    alignSelf: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    marginVertical: 12,
    backgroundColor: Colors.GREEN,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});
