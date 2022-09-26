import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Slider from 'rn-range-slider';
import { Picker } from '@react-native-picker/picker';
import { close } from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProductChecked: false,
      productName: '',
      isCategoryChecked: true,
      categoryName: '',
      categoryId: props.getStoreProducts?.data[0].id,
      isPriceChecked: false,
      maxPrice: 1000,
      rangePrice: '',
    };
  }

  Checkbox = (type, value) => {
    console.warn(type);
    if (
      !this.state.isProductChecked ||
      !this.state.isCategoryChecked ||
      !this.state.isPriceChecked
    ) {
      this.setState({ [type]: value });
    } else {
      this.setState({ [type]: value });
    }
  };

  onChangePrice = value => {
    this.setState({ rangePrice: value });
  };

  applyFilter = () => {
    let { productName, categoryId, rangePrice, maxPrice } = this.state;
    let role = this.props.role;

    if (role == 'store' || role == 'facility' || role == 'coach' || role == 'staff') {
      this.props.getStoreProductList({
        text: '',
        productName,
        categoryId,
        minPrice: rangePrice,
        maxPrice,
      });
    } else {
      this.props.getAllStoreProducts({
        text: '',
        productName,
        categoryId,
        minPrice: rangePrice,
        maxPrice,
      });

      this.props.getAllUsedProducts({
        text: '',
        productName,
        categoryId,
        minPrice: rangePrice,
        maxPrice,
      });
    }
  };

  // selectCategoryName = value => {
  //   if (!this.state.isCategoryChecked && !this.state.categoryId) {
  //     this.setState({
  //       categoryName: value,
  //       categoryId: value,
  //       isCategoryChecked: true,
  //     });
  //   } else if (this.state.categoryId && this.state.isCategoryChecked) {
  //     console.warn('dsdasda');
  //     this.setState({
  //       categoryName: value,
  //       categoryId: value,
  //       isCategoryChecked: true,
  //     });
  //   } else {
  //     this.setState({
  //       categoryName: '',
  //       categoryId: '',
  //       isCategoryChecked: false,
  //     });
  //   }
  // };

  render() {
    let { width, height } = Dimensions.get('window');
    let { onClose } = this.props;

    console.warn(this.state.categoryId);

    return (
      <View style={styles.container}>
        <View style={styles.topLine} />

        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onClose}>
            <Image source={close} style={{ width: 12, height: 12 }} />
          </TouchableOpacity>

          {/* <Text style={{fontSize: 16, color: Colors.BLACK}}>Reset</Text> */}
        </View>

        <Text style={styles.title}>Filter</Text>
        {/* 
        <View style={styles.pickerContainer}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() =>
                this.Checkbox(
                  'isProductChecked',
                  !this.state.isProductChecked ? true : false,
                )
              }>
              <MaterialIcons
                color={
                  !this.state.isProductChecked ? Colors.BLACK : Colors.BLUE
                }
                name={
                  !this.state.isProductChecked
                    ? 'check-box-outline-blank'
                    : 'check-box'
                }
                size={20}
              />
            </TouchableOpacity>
          </View>

          <Picker
            selectedValue={this.state.productName}
            style={styles.picker}
            onValueChange={(value, itemIndex) =>
              this.setState({productName: value})
            }>
            <Picker.Item label="Product name" value="" />
            <Picker.Item label="Shirt" value="shirt" />
            <Picker.Item label="Bat" value="bat" />
            <Picker.Item label="Football" value="football" />
          </Picker>
        </View> */}

        <View style={[styles.pickerContainer, { marginVertical: 10 }]}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() =>
                this.Checkbox(
                  'isCategoryChecked',
                  !this.state.isCategoryChecked ? true : false,
                )
              }>
              <MaterialIcons
                color={
                  !this.state.isCategoryChecked ? Colors.BLACK : Colors.BLUE
                }
                name={
                  !this.state.isCategoryChecked
                    ? 'check-box-outline-blank'
                    : 'check-box'
                }
                size={20}
              />
            </TouchableOpacity>
          </View>

          <Picker
            selectedValue={this.state.categoryName}
            style={styles.picker}
            onValueChange={(value, itemIndex) => {
              // this.selectCategoryName(value);
              this.setState({
                categoryName: value,
                categoryId: value,
              });
            }}>
            {/* <Picker.Item label="Category name" value="" /> */}
            {this.props.getStoreProducts?.data.map(item => {
              return (
                <Picker.Item
                  label={item.productcategory_name}
                  value={item.id}
                  key={item.id}
                />
              );
            })}
            {/* <Picker.Item label="Category name" value="" />
            <Picker.Item label="Shirts" value="shirts" />
            <Picker.Item label="Kit" value="Kit" />
            <Picker.Item label="Hats" value="Hats" /> */}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() =>
                this.Checkbox(
                  'isPriceChecked',
                  !this.state.isPriceChecked ? true : false,
                )
              }>
              <MaterialIcons
                color={!this.state.isPriceChecked ? Colors.BLACK : Colors.BLUE}
                name={
                  !this.state.isPriceChecked
                    ? 'check-box-outline-blank'
                    : 'check-box'
                }
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TextInput
              value={this.state.productName}
              onChangeText={text =>
                text
                  ? this.setState({ productName: text, isPriceChecked: true })
                  : this.setState({ productName: '', isPriceChecked: false })
              }
              placeholder="Product name"
              placeholderTextColor={Colors.GRAY_3}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                fontSize: 16,
                backgroundColor: Colors.WHITE,
              }}
            />
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={{
              alignItems: 'stretch',
              width: '95%',
            }}
            min={0}
            max={1000}
            step={1}
            allowLabelOverflow={false}
            floatingLabel
            renderThumb={() => <View style={styles.thumb} />}
            renderRail={() => <View style={styles.rail} />}
            renderRailSelected={() => <View style={styles.selectedRail} />}
            renderNotch={() => <View style={styles.notch} />}
            onValueChanged={this.onChangePrice}
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${this.state.rangePrice}</Text>

          <Text style={styles.price}>${this.state.maxPrice}</Text>
        </View>

        <View style={{ flex: 0.25, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.applyFilter}
            activeOpacity={0.7}
            style={styles.button}>
            <Text style={styles.btnText}>Apply filter</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.topLine, { backgroundColor: Colors.BLUE, bottom: 0 }]}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
  getStoreProducts: state.StoreReducer.storeProducts,
  getUsedProducts: state.StoreReducer.UsedProducts,

});
const mapDispatchToProps = dispatch => ({
  getAllStoreProducts: payload =>
    dispatch(StoreMiddleware.getAllStoreProductsForUsers(payload)),
  getAllUsedProducts: payload =>
    dispatch(StoreMiddleware.getAllUsedProductsForUsers(payload)),
  getStoreProductList: payload =>
    dispatch(StoreMiddleware.GetStoreProduts(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.GRAY_4,
  },
  topLine: {
    width: 80,
    height: 2,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: Colors.GRAY_1,
    marginVertical: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.BLACK,
    marginBottom: 16,
  },
  pickerContainer: {
    width: '85%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: Platform.OS == 'ios' ? null : 50,
    backgroundColor: Colors.WHITE,
  },
  checkboxContainer: {
    flex: 0.15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GRAY_4,
  },
  productContainer: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.WHITE,
    paddingLeft: 18,
    justifyContent: 'center',
  },
  sliderContainer: {
    width: '85%',
    alignSelf: 'center',
    marginVertical: 12,
    alignItems: 'flex-end',
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 16,
    borderColor: Colors.BLUE_LIGHT,
    backgroundColor: Colors.BLUE,
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#76C0E4',
  },
  selectedRail: {
    height: 4,
    backgroundColor: '#4499ff',
    borderRadius: 2,
  },
  //   label: {
  //     alignItems: 'center',
  //     padding: 8,
  //     backgroundColor: Colors.BLUE,
  //     borderRadius: 4,
  //   },
  notch: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4499ff',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
  priceContainer: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    alignSelf: 'center',
    backgroundColor: Colors.BLUE,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.WHITE,
  },
  price: {
    fontSize: 16,
    color: Colors.BLACK,
    paddingLeft: 16,
  },
});
