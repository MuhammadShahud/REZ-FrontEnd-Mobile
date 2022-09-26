import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Button, Text, Header, Tag, Post, Loader } from '../../Components';
import {
  imageIcon,
} from '../../Assets';
import { Colors } from '../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import PostCreateMiddleware from '../../Store/Middleware/PostCreateMiddleware';
import { OpenImagePicker } from '../../Config';

class index extends Component {
  state = {
    description: '',
    title: '',
    image: null,
    loader: false,
  };

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };


  postCreate = () => {
    let {
      description,
      title,
      image,
    } = this.state;

    // let productCategoryItem = this.props.getProductCategories.find(item => {
    //   if (productType === item.productcategory_name) {
    //     return item;
    //   }
    // });

    if (
      !description ||
      !title ||
      !image
    ) {
      Alert.alert('Warning', 'Please enter all fields!');
    } else {
      this.setState({ loader: true });
      this.props
        .postCreate({
          description: description,
          title: title,
          image: image,
        }).then(() => {
          this.setState({ loader: false });
          Alert.alert('Alert', 'Post Created Successfully..!');
          this.props.navigation.goBack();
        }).catch(() => {
          this.setState({ loader: false });
        })

      // .then(() => {
      //   this.setState({ loader: false });
      //   this.props.navigation.navigate('UserProfile')
      // })
      // .catch(error => {
      //   this.setState({ loader: false });
      // });
    }
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


  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Upload"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View
            style={{
              backgroundColor: Colors.GRAY_2,
              borderRadius: 20,
              padding: 10,
              flex: 0.99,
              marginVertical: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <View >
                {this.state.image?.uri ? (
                  <TouchableOpacity
                    onPress={this.uploadImage}
                    style={{
                      backgroundColor: Colors.WHITE,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 300,
                      margin: 15,
                      borderRadius: 20,
                    }}>
                    <Image
                      source={{ uri: this.state.image?.uri }}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 12,
                        elevation: 3,
                      }}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                      Change Image/Video
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={this.uploadImage}
                      style={{
                        backgroundColor: Colors.WHITE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 300,
                        margin: 15,
                        borderRadius: 20,
                      }}>
                      <Image
                        source={imageIcon}
                        resizeMode="contain"
                        style={{ width: 100, height: 100, marginHorizontal: 10 }}
                      />
                      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                        Select Image/Video
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* <TouchableOpacity
                onPress={this.uploadImage}
                style={{
                  backgroundColor: Colors.WHITE,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  margin: 15,
                  borderRadius: 20,
                }}>
                <Image
                  source={imageIcon}
                  resizeMode="contain"
                  style={{ width: 100, height: 100, marginHorizontal: 10 }}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  Select Image/Video
                </Text>
              </TouchableOpacity> */}

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  margin: 15,
                  borderRadius: 20,
                }}>
                <TextInput
                  style={{ height: 60, textAlignVertical: 'top', padding: 20 }}
                  placeholder="Title...."
                  value={this.state.title}
                  onChangeText={text => this.setState({ title: text })}
                  multiline
                />
              </View>

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  margin: 15,
                  borderRadius: 20,
                }}>
                <TextInput
                  style={{ height: 120, textAlignVertical: 'top', padding: 20 }}
                  placeholder="Give your description here...."
                  value={this.state.description}
                  onChangeText={text => this.setState({ description: text })}
                  multiline
                />
              </View>

              <View style={{ marginVertical: 0, marginHorizontal: 20 }}>
                <Button
                  onPress={this.postCreate}
                  name="Upload"
                  backgroundColor={Colors.BLUE}
                  textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
                />
              </View>
            </ScrollView>
          </View>
          <Loader loader={this.state.loader} />
        </View>
      </>
    );
  }
}

const mapstateToProps = state => ({
  // getProductCategories: state.StoreReducer.productCategories,
});

const mapDispatchToProps = dispatch => ({
  // ProductCategories: () => dispatch(StoreMiddleware.GetProductCategory()),
  postCreate: payload =>
    dispatch(PostCreateMiddleware.PostCreate(payload)),
});

export default connect(mapstateToProps, mapDispatchToProps)(index);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  isSelectedView: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  isNotSelectedView: {
    backgroundColor: Colors.GRAY_4,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  sheetBody: {
    marginVertical: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  closeImage: { width: 60, height: 20 },
});
