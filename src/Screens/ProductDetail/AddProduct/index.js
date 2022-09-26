import React, { Component } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal
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
import StoreMiddleware from '../../../Store/Middleware/StoreMiddleware';
import { OpenImagePicker } from '../../../Config';

class AddProduct extends Component {
  state = {
    productTitle: '',
    discription: '',
    productPrice: '',
    productColor: '',
    productType: undefined,
    image: null,
    productSizes: ['Small', 'Medium', 'Large'],
    selectedSizes: [],
    loader: false,
    isUsed: true,
    isNew: false,
    addCategory: false,
    addCategoryName: false,
  };

  componentDidMount() {
    this.props.ProductCategories();
    this.props.ProductSizes();
  }

  uploadProduct = () => {
    let {
      productTitle,
      productColor,
      productPrice,
      productType,
      discription,
      selectedSizes,
      image,
    } = this.state;

    let productCategoryItem = this.props.getProductCategories.find(item => {
      if (productType === item.productcategory_name) {
        return item;
      }
    });

    if (this.state.selectedSizes.length < 1) {
      alert('Select product size.');
      return;
    }

    if (
      !productTitle ||
      !productColor ||
      !productPrice ||
      !productType ||
      !image
    ) {

      Alert.alert('Warning', 'Please enter all fields!');
    } else {
      let type = this.props.role === 'player' || this.props.role === 'parent' ? 'old' : 'new';

      this.setState({ loader: true });
      this.props
        .uploadStoreProduct({
          productTitle,
          productPrice,
          productColor,
          productTypeId: productCategoryItem.id,
          discription,
          selectedSizes,
          image,
          type,
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

  AddCategory = () => {
    let name = this.state.addCategoryName;
    if (
      !name
    ) {

      Alert.alert('Warning', 'Please enter all fields!');
    } else {
      this.setState({ loader: true });
      this.props
        .uploadCategory(
          name
        )
        .then(data => {
          this.setState({ loader: false });
          this.props.ProductCategories();
          // this.addcatSheet.snapTo(1);
          this.setState({ addCategory: true })
        })
        .catch(error => {
          this.setState({ loader: false });
        });
    }
  }

  uploadProductImage = () => {
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
          <Text style={styles.sheetHeading}>Your Product has been added</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };

  renderAddCat = () => {
    return (
      <View style={styles.SheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.addcatSheet.snapTo(1);
          }}>
          <Image
            source={close}
            style={styles.closeImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        {this.state.addCategory ? <View style={styles.sheetBody}>
          <Image
            source={check_blue}
            style={styles.checkImage}
            resizeMode={'contain'}
          />
          <Text style={styles.sheetHeading}>Your Category has been added</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View> :
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category Name</Text>
            <TextInput
              style={{ backgroundColor: Colors.WHITE, marginTop: 5 }}
              placeholder={'Name'}
              onChangeText={text => this.setState({ addCategoryName: text })}
            />
            <Button
              onPress={this.AddCategory}
              btnStyle={styles.mv10}
              name={'Add Category'}
              loading={this.state.loader}
              backgroundColor={Colors.BLUE}
              textStyle={styles.cWhite}
            />
          </View>
        }


      </View>
    );
  };


  unCheckSize = item => {
    let { selectedSizes } = this.state;
    let selectedSizesCopy = [...selectedSizes];
    let index = selectedSizesCopy.findIndex(val => val === item);
    selectedSizesCopy.splice(index, 1);
    this.setState({ selectedSizes: selectedSizesCopy });
  };


  render() {
    const { selectedSizes } = this.state;
    let productCategories = this.props.getProductCategories.map(item => {
      return item?.productcategory_name;
    });

    let productsize = this.props.getProductSizes;

    console.warn(selectedSizes);

    return (
      <>
        <View style={styles.container}>
          <Header
            isShowLeftIcon
            navigation={this.props.navigation}
            title={'Store'}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Category</Text>
              <SelectDropdown
                data={productCategories}
                defaultValue={this.state.productTypeId}
                dropdownIconPosition="right"
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownGreyIcon}
                      style={{ width: 20 }}
                    />
                  );
                }}
                buttonTextStyle={styles.dropDownBtnText}
                buttonStyle={styles.btnStyle}
                onSelect={(val, index) => {
                  this.setState({ productType: val });
                }}
              />


            </View>

            <View style={[styles.inputContainer, { width: '95%', alignSelf: "center" }]}>
              <Tag
                key={1}
                isActiveBlue={true}
                text={"Add Category"}
                onPress={() => this.addcatSheet.snapTo(0)
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Title</Text>
              <TextInput
                value={this.state.productTitle}
                placeholder={'Title Here'}
                onChangeText={text => this.setState({ productTitle: text })}
              />
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {productsize.map((item, index) => {
                let isChecked = this.state.selectedSizes?.some(
                  val => val === item.name,
                );
                return (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <CheckBox
                        onCheckColor={Colors.BLUE}
                        value={isChecked}
                        onValueChange={newValue => {
                          if (!isChecked) {
                            this.state.selectedSizes.push(item.name);
                            this.setState({ selectedSizes });
                          } else {
                            this.unCheckSize(item.name);
                          }
                        }}
                      />
                      <Text style={{marginLeft:5}}>{item.name}</Text>
                    </View>
                  </>
                );
              })}

              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  onCheckColor={Colors.BLUE}
                  // value={sizes === 'small'}
                  onValueChange={newValue => this.selectSizes({text: 'small'})}
                />
                <Text>Small</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  // value={sizes === 'medium'}
                  onValueChange={newValue => this.selectSizes({text: 'medium'})}
                />
                <Text>Medium</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  // value={sizes === 'large'}
                  onValueChange={newValue => this.selectSizes({text: 'large'})}
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                value={this.state.productPrice}
                placeholder={'Enter Price'}
                // endIcon={calendar_gray}
                keyboardType="numeric"
                onChangeText={text => this.setState({ productPrice: text })}
                endIcon={false}
              />
            </View>

            <View style={{ width: '100%', marginTop: 10 }}>
              <Text style={{ color: Colors.GRAY_1 }}>Description</Text>
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
              <Text style={styles.inputLabel}>Select Color</Text>
              <TextInput
                placeholder={'Enter Color'}
                value={this.state.productColor}
                onChangeText={text => this.setState({ productColor: text })}
              />
            </View>
            {this.props.role === 'player' || this.props.role === 'parent' ?
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Product Type</Text>
                <View style={{ flexDirection: "row", marginVertical: 10 }} >
                  <Tag
                    key={1}
                    isActiveBlue={this.state.isUsed}
                    text={"Used"}
                    onPress={() => this.setState({ isUsed: true, isNew: false })}
                  />
                  {/* <Tag
                    key={2}
                    isActiveBlue={this.state.isNew}
                    text={"New"}
                    onPress={() => this.setState({ isUsed: false, isNew: true })}
                  /> */}
                </View>

              </View> : null}


            <View style={styles.inputContainer}>
              {this.state.image?.uri ? (
                <Image
                  source={{ uri: this.state.image?.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    elevation: 3,
                  }}
                />
              ) : (
                <View>
                  <Text style={styles.inputLabel}>Upload Image</Text>
                  <TouchableOpacity onPress={this.uploadProductImage}>
                    <TextInput
                      editable={false}
                      placeholder={'Upload Image'}
                      endIcon={upload}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Button
              onPress={this.uploadProduct}
              btnStyle={styles.mv20}
              name={'Add Product'}
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

        <BottomSheet
          ref={ref => (this.addcatSheet = ref)}
          initialSnap={1}
          snapPoints={[280, -200]}
          borderRadius={10}
          renderContent={this.renderAddCat}
        />

      </>
    );
  }
}

const mapstateToProps = state => ({
  role: state.Auth.role,
  getProductCategories: state.StoreReducer.productCategories,
  getProductSizes: state.StoreReducer.productSizes,
});

const mapDispatchToProps = dispatch => ({
  ProductCategories: () => dispatch(StoreMiddleware.GetProductCategory()),
  ProductSizes: () => dispatch(StoreMiddleware.GetProductSizes()),

  uploadStoreProduct: payload =>
    dispatch(StoreMiddleware.UploadStoreProduct(payload)),

  uploadCategory: payload =>
    dispatch(StoreMiddleware.AddCategory(payload)),
});

export default connect(mapstateToProps, mapDispatchToProps)(AddProduct);

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
  mv10: {
    marginVertical: 10,
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
  SheetContainer: {
    backgroundColor: Colors.GRAY_4,
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
