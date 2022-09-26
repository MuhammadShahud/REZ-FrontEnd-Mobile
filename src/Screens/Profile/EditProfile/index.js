import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { close, dropdownIcon, dummy, plus_circle_blue } from '../../../Assets';
import { Button, Header, Loader, TextInput } from '../../../Components';
import { dummyImage, OpenImagePicker } from '../../../Config';
import { img_url } from '../../../Store/Apis';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import { Colors } from '../../../Styles';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

class index extends Component {
  constructor(props) {
    let { user } = props;
    super(props);
    this.state = {
      username: user?.username ? user?.username : '',
      usercolor: '',
      selectedLevel: '',
      selectedGender: '',
      contact: user?.phone ? user?.phone : '',
      address: user?.address ? user?.address : '',
      govtId: user?.roleInfo?.govt_id ? user?.roleInfo?.govt_id : '',
      taxId: user?.roleInfo?.tax_id ? user?.roleInfo?.tax_id : '',
      detail: user?.roleInfo?.details ? user?.roleInfo?.details : '',
      description: user?.description
        ? user?.description
        : '',
      image: null,
      loader: false,
      dobModalVisible: false,
      dob:
        user?.roleInfo?.dob || user?.roleInfo?.dob !== undefined
          ? new Date(user?.roleInfo?.dob)
          : new Date(),
      levels: ['Beginner', 'Intermediate', 'Expert'],
      level: user?.roleInfo?.level ? user?.roleInfo?.level : '',
      genders: ['male', 'female'],
      // childs: user?.childInfo.length > 0 ? user?.childInfo : [],
      childEmail: '',
      color_code: '',

    };
  }
  componentDidMount() {
    this.props.getColors();
  }


  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  updateProfile = () => {
    let { user, role } = this.props;
    this.setState({ loader: true });

    let {
      username,
      selectedLevel,
      description,
      image,
      selectedGender,
      contact,
      address,
      govtId,
      taxId,
      dob,
      detail,
      color_code,
    } = this.state;

    this.props
      .updateProfile({
        username,
        selectedLevel: selectedLevel ? selectedLevel : user?.roleInfo?.level,
        description,
        image: image?.uri ? image : user?.profile_image,
        gender: selectedGender ? selectedGender : user?.roleInfo?.gender,
        contact,
        detail,
        address,
        govtId,
        taxId,
        dob:
          role !== 'facility' || role !== 'store'
            ? new Date(dob).toISOString()
            : dob,
        color_code: color_code,
      })
      .then(val => {
        this.setState({ loader: false }, () => {
          this.props.navigation.goBack();
        });
      })
      .catch(err => {
        this.setState({ loader: false });
      });
  };

  SelectProfilePicture = () => {
    OpenImagePicker(img => {
      console.warn(img);
      let spirit_uri = img.path.split('/');
      let name = spirit_uri[spirit_uri.length - 1];

      let imgObj = {
        name,
        uri: img.path,
        size: img.size,
        type: img.mime,
      };
      this.setState({ image: imgObj });
    });
  };

  selectUserDob = () => {
    return (
      <DatePicker
        modal
        open={this.state.dobModalVisible}
        mode={'date'}
        date={this.state.dob ? this.state.dob : new Date()}
        maximumDate={new Date()}
        onConfirm={date => {
          this.setState({ dobModalVisible: false, dob: date });
        }}
        onCancel={() => {
          this.setState({ dobModalVisible: false });
        }}
      />
      // </View>
    );
  };

  onPressAddChildname = () => {
    const { childEmail } = this.state;
    this.setState({ loader: true }, () => {
      this.props
        .checkChildEmail(childEmail)
        .then(data => {
          let selectedChildListCopy = this.state.childs;
          const isFound = selectedChildListCopy.find(x => x.id === data.id);
          if (!isFound) {
            this.state.childs.push(data);
          }
          this.setState({ loader: false, childEmail: '' });
        })
        .catch(err => {
          this.setState({ loader: false });
        });
    });
  };

  // onPressCroseChidlEmail = index => {
  //   let selectedChildListCopy = this.state.childs;
  //   selectedChildListCopy.splice(index, 1);
  //   this.setState({childs: selectedChildListCopy});
  // };

  handleChangecolor = value => {
    this.setState({ usercolor: value });
    console.warn(value);
  };

  renderStoreEditProfileItems = () => {
    let { user } = this.props;
    let getcolors = this.props.getcolors && this.props.getcolors.length > 0 ? this.props.getcolors.map(item => {
      return item.name;
    }) : null;
    return (
      <>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 15,
            borderRadius: 10,
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="User Name"
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
          </View>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Email"
              value={user?.email}
              editable={false}
            />
          </View>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Contact"
              value={this.state.contact}
              onChangeText={text => this.setState({ contact: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Government ID"
              value={this.state.govtId}
              onChangeText={text => this.setState({ govtId: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Tax ID"
              value={this.state.taxId}
              onChangeText={text => this.setState({ taxId: text })}
            />
          </View>
          {getcolors && getcolors.length > 0 ?
            <View style={{ width: '100%', marginTop: 20 }}>
              <SelectDropdown
                data={getcolors}
                dropdownIconPosition="right"
                defaultButtonText={'Select Color'}
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownIcon}
                      style={{ width: 20, tintColor: Colors.GRAY_6 }}
                    />
                  );
                }}
                buttonTextStyle={{
                  textAlign: 'left',
                  color: Colors.GRAY_1,
                  fontSize: 16,
                }}
                buttonStyle={{
                  // backgroundColor: Colors.BLUE_LIGHT,
                  width: '100%',
                  marginTop: 5,
                }}
                onSelect={(selectedItem, index) => {
                  this.setState({ color_code: this.props.getcolors[index].code });
                }}
              />
            </View> : null}


          <View style={{ width: '100%', marginTop: 20 }}>
            <Button
              height={50}
              name={'Save'}
              textStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.WHITE,
              }}
              backgroundColor={Colors.BLUE}
              onPress={this.updateProfile}
            />
          </View>


        </View>
      </>
    );
  };

  renderParentEditProfile = () => {
    let { user } = this.props;
    let userDob = new Date(this.state.dob).toDateString().slice(4, 15);
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })
    console.warn(user);
    return (
      <View
        style={{
          backgroundColor: Colors.WHITE,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 15,
          borderRadius: 10,
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}>
        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="User Name"
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Bio"
            value={this.state.description}
            multiline={true}
            onChangeText={text => this.setState({ description: text })}
          />
        </View>

        <SelectDropdown
          defaultValue={user?.roleInfo?.gender}
          data={this.state.genders}
          dropdownIconPosition="right"
          renderDropdownIcon={() => {
            return (
              <Image
                resizeMode="contain"
                source={dropdownIcon}
                style={{ width: 16, height: 20, tintColor: Colors.GRAY_6 }}
              />
            );
          }}
          buttonTextStyle={{
            textAlign: 'left',
            color: Colors.GRAY_3,
            fontSize: 16,
          }}
          buttonStyle={{
            backgroundColor: Colors.GRAY_PRIMARY,
            width: '100%',
            marginTop: 5,
            borderRadius: 12,
          }}
          onSelect={(selectedItem, index) => {
            this.setState({ selectedGender: selectedItem });
          }}
        />

        <TouchableOpacity
          onPress={() => {
            this.setState({ dobModalVisible: true });
          }}
          style={{
            marginVertical: 5,
            backgroundColor: Colors.GRAY_PRIMARY,
            width: '100%',
            borderRadius: 12,
          }}>
          <Text style={{ padding: 13 }}>
            {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
          </Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput placeholder="Email" value={user?.email} editable={false} />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Contact"
            value={this.state.contact}
            onChangeText={text => this.setState({ contact: text })}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            value={this.state.address}
            placeholder={'Address'}
            multiline
            numberOfLines={3}
            onChangeText={text => this.setState({ address: text })}
            // placeholderTextColor={Colors.GRAY_1}
            style={{
              height: 100,
              // backgroundColor: Colors.BLUE_LIGHT,
              textAlignVertical: 'top',
              padding: 10,
              fontSize: 16,
              marginVertical: 5,
              color: Colors.GRAY_5,
            }}
          />
        </View>
        {getcolors && getcolors.length > 0 ?
          <View style={{ width: '100%', marginTop: 20 }}>
            <SelectDropdown
              data={getcolors}
              dropdownIconPosition="right"
              defaultButtonText={'Select Color'}
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownIcon}
                    style={{ width: 20, tintColor: Colors.GRAY_6 }}
                  />
                );
              }}
              buttonTextStyle={{
                textAlign: 'left',
                color: Colors.GRAY_1,
                fontSize: 16,
              }}
              buttonStyle={{
                // backgroundColor: Colors.BLUE_LIGHT,
                width: '100%',
                marginTop: 5,
              }}
              onSelect={(selectedItem, index) => {
                this.setState({ color_code: this.props.getcolors[index].code });
              }}
            />
          </View>
          : null}
        {/* <View style={{marginVertical: 5, width: '100%'}}>
          <TextInput
            placeholder="Government ID"
            value={this.state.govtId}
            onChangeText={text => this.setState({govtId: text})}
          />
        </View> */}

        {/* <View style={{width: '100%', marginTop: 10}}>
          <Text style={{color: Colors.GRAY_1}}>Add Child</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="Child Email"
              onChangeText={text => this.setState({childEmail: text})}
              value={this.state.childEmail}
              inputContainerStyle={{
                backgroundColor: Colors.BLUE_LIGHT,
                flex: 1,
              }}
            />
            <TouchableOpacity onPress={this.onPressAddChildname}>
              <Image
                source={plus_circle_blue}
                style={{
                  marginLeft: 10,
                  width: 30,
                  height: 30,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          {this.state.childs.map((x, i) => {
            return (
              <View style={styles.childEmailItemContainer}>
                <Text>{x.email}</Text>
                <TouchableOpacity
                  onPress={() => this.onPressCroseChidlEmail(i)}>
                  <Image source={close} style={{width: 10, height: 10}} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View> */}

        <View style={{ width: '100%', marginTop: 20 }}>
          <Button
            height={50}
            name={'Save'}
            textStyle={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.WHITE,
            }}
            backgroundColor={Colors.BLUE}
            onPress={this.updateProfile}
          />
        </View>
      </View>
    );
  };

  renderPlayerEditProfileItems = role => {
    let { user } = this.props;
    let userDob = new Date(this.state.dob).toDateString().slice(4, 15);
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })
    return (
      <>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 15,
            borderRadius: 10,
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="User Name"
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
          </View>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Bio"
              value={this.state.description}
              multiline={true}
              onChangeText={text => this.setState({ description: text })}
            />
          </View>

          <SelectDropdown
            defaultValue={user?.roleInfo?.gender}
            data={this.state.genders}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Image
                  resizeMode="contain"
                  source={dropdownIcon}
                  style={{ width: 16, height: 20, tintColor: Colors.GRAY_6 }}
                />
              );
            }}
            buttonTextStyle={{
              textAlign: 'left',
              color: Colors.GRAY_3,
              fontSize: 16,
            }}
            buttonStyle={{
              backgroundColor: Colors.GRAY_PRIMARY,
              width: '100%',
              marginTop: 5,
              borderRadius: 12,
            }}
            onSelect={(selectedItem, index) => {
              this.setState({ selectedGender: selectedItem });
            }}
          />

          <TouchableOpacity
            onPress={() => {
              this.setState({ dobModalVisible: true });
            }}
            style={{
              marginVertical: 5,
              backgroundColor: Colors.GRAY_PRIMARY,
              width: '100%',
              borderRadius: 12,
            }}>
            <Text style={{ padding: 13 }}>
              {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
            </Text>
          </TouchableOpacity>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Email"
              value={user?.email}
              editable={false}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Contact"
              value={this.state.contact}
              onChangeText={text => this.setState({ contact: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder={'Address'}
              multiline
              numberOfLines={3}
              value={this.state.address}
              onChangeText={text => this.setState({ address: text })}
              // placeholderTextColor={Colors.GRAY_1}
              style={{
                height: 100,
                // backgroundColor: Colors.BLUE_LIGHT,
                textAlignVertical: 'top',
                padding: 10,
                fontSize: 16,
                marginVertical: 5,
                // color: Colors.GRAY_1,
              }}
            />
          </View>

          <SelectDropdown
            data={this.state.levels}
            defaultValue={user?.roleInfo?.level}
            dropdownIconPosition="right"
            renderDropdownIcon={() => {
              return (
                <Image
                  resizeMode="contain"
                  source={dropdownIcon}
                  style={{ width: 16, height: 20, tintColor: Colors.GRAY_6 }}
                />
              );
            }}
            buttonTextStyle={{
              textAlign: 'left',
              color: Colors.GRAY_1,
              fontSize: 16,
            }}
            buttonStyle={{
              backgroundColor: Colors.GRAY_4,
              width: '100%',
              marginTop: 5,
              borderRadius: 12,
            }}
            onSelect={(selectedItem, index) => {
              this.setState({ selectedLevel: selectedItem });
            }}
          />

          <View style={{ marginVertical: 8, width: '100%' }}>
            <TextInput
              placeholder="Government ID"
              value={this.state.govtId}
              onChangeText={text => this.setState({ govtId: text })}
            />
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            {getcolors && getcolors.length > 0 ?
              <SelectDropdown
                data={getcolors}
                dropdownIconPosition="right"
                defaultButtonText={'Select Color'}
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownIcon}
                      style={{ width: 20, tintColor: Colors.GRAY_6 }}
                    />
                  );
                }}
                buttonTextStyle={{
                  textAlign: 'left',
                  color: Colors.GRAY_1,
                  fontSize: 16,
                }}
                buttonStyle={{
                  // backgroundColor: Colors.BLUE_LIGHT,
                  width: '100%',
                  marginTop: 5,
                }}
                onSelect={(selectedItem, index) => {
                  this.setState({ color_code: this.props.getcolors[index].code });
                }}
              /> : null}
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Button
              height={50}
              name={'Save'}
              textStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.WHITE,
              }}
              backgroundColor={Colors.BLUE}
              onPress={this.updateProfile}
            />
          </View>
        </View>
      </>
    );
  };

  renderFacilityEditProfileItems = role => {
    let { user } = this.props;
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })

    return (
      <>
        <View
          style={{
            backgroundColor: Colors.WHITE,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 15,
            borderRadius: 10,
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="User Name"
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Bio"
              value={this.state.description}
              multiline={true}
              onChangeText={text => this.setState({ description: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Email"
              value={user?.email}
              editable={false}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Contact"
              value={this.state.contact}
              onChangeText={text => this.setState({ contact: text })}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder="Detail"
              value={this.state.detail}
              onChangeText={text => this.setState({ detail: text })}
              style={{ height: 70 }}
            />
          </View>

          <View style={{ marginVertical: 5, width: '100%' }}>
            <TextInput
              placeholder={'Address'}
              multiline
              numberOfLines={3}
              value={this.state.address}
              onChangeText={text => this.setState({ address: text })}
              // placeholderTextColor={Colors.GRAY_1}
              style={{
                height: 70,
                // backgroundColor: Colors.BLUE_LIGHT,
                textAlignVertical: 'top',
                padding: 10,
                fontSize: 16,
                marginVertical: 5,
                // color: Colors.GRAY_1,
              }}
            />
          </View>

          <View style={{ marginVertical: 8, width: '100%' }}>
            <TextInput
              placeholder="Government ID"
              value={this.state.govtId}
              onChangeText={text => this.setState({ govtId: text })}
            />
          </View>

          <View style={{ marginVertical: 8, width: '100%' }}>
            <TextInput
              placeholder="Tax ID"
              value={this.state.taxId}
              onChangeText={text => this.setState({ taxId: text })}
            />
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            {getcolors && getcolors.length > 0 ?
              <SelectDropdown
                data={getcolors}
                dropdownIconPosition="right"
                defaultButtonText={'Select Color'}
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownIcon}
                      style={{ width: 20, tintColor: Colors.GRAY_6 }}
                    />
                  );
                }}
                buttonTextStyle={{
                  textAlign: 'left',
                  color: Colors.GRAY_1,
                  fontSize: 16,
                }}
                buttonStyle={{
                  // backgroundColor: Colors.BLUE_LIGHT,
                  width: '100%',
                  marginTop: 5,
                }}
                onSelect={(selectedItem, index) => {
                  this.setState({ color_code: this.props.getcolors[index].code });
                }}
              /> : null}
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Button
              height={50}
              name={'Save'}
              textStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.WHITE,
              }}
              backgroundColor={Colors.BLUE}
              onPress={this.updateProfile}
            />
          </View>
        </View>
      </>
    );
  };

  renderTeamProfileEdit = () => {
    let { user } = this.props;
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })
    return (
      <View
        style={{
          backgroundColor: Colors.WHITE,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 15,
          borderRadius: 10,
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}>
        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Team Name"
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Bio"
            value={this.state.description}
            multiline={true}
            onChangeText={text => this.setState({ description: text })}
          />
        </View>

        <SelectDropdown
          data={this.state.levels}
          defaultValue={user?.roleInfo?.level}
          dropdownIconPosition="right"
          renderDropdownIcon={() => {
            return (
              <Image
                resizeMode="contain"
                source={dropdownIcon}
                style={{ width: 20 }}
              />
            );
          }}
          buttonTextStyle={{
            textAlign: 'left',
            color: Colors.GRAY_1,
            fontSize: 16,
          }}
          buttonStyle={{
            backgroundColor: Colors.BLUE_LIGHT,
            width: '100%',
            marginTop: 5,
          }}
          onSelect={(selectedItem, index) => {
            this.setState({ selectedLevel: selectedItem });
          }}
        />

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput placeholder="Email" value={user?.email} editable={false} />
        </View>



        <View style={{ width: '100%', marginTop: 20 }}>
          {getcolors && getcolors.length > 0 ?
            <SelectDropdown
              data={getcolors}
              dropdownIconPosition="right"
              defaultButtonText={'Select Color'}
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownIcon}
                    style={{ width: 20, tintColor: Colors.GRAY_6 }}
                  />
                );
              }}
              buttonTextStyle={{
                textAlign: 'left',
                color: Colors.GRAY_1,
                fontSize: 16,
              }}
              buttonStyle={{
                // backgroundColor: Colors.BLUE_LIGHT,
                width: '100%',
                marginTop: 5,
              }}
              onSelect={(selectedItem, index) => {
                this.setState({ color_code: this.props.getcolors[index].code });
              }}
            /> : null}
        </View>

        <View style={{ width: '100%', marginTop: 20 }}>
          <Button
            height={50}
            name={'Save'}
            textStyle={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.WHITE,
            }}
            backgroundColor={Colors.BLUE}
            onPress={this.updateProfile}
          />
        </View>
      </View>
    );
  };

  renderCoachProfileEdit = () => {
    let { user } = this.props;
    let userDob = new Date(this.state.dob).toDateString().slice(4, 15);
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })
    return (
      <View
        style={{
          backgroundColor: Colors.WHITE,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 15,
          borderRadius: 10,
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}>
        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="User Name"
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Bio"
            value={this.state.description}
            multiline={true}
            onChangeText={text => this.setState({ description: text })}
          />
        </View>

        <SelectDropdown
          defaultValue={user?.roleInfo?.gender}
          data={this.state.genders}
          dropdownIconPosition="right"
          renderDropdownIcon={() => {
            return (
              <Image
                resizeMode="contain"
                source={dropdownIcon}
                style={{ width: 16, height: 20, tintColor: Colors.GRAY_6 }}
              />
            );
          }}
          buttonTextStyle={{
            textAlign: 'left',
            color: Colors.GRAY_3,
            fontSize: 16,
          }}
          buttonStyle={{
            backgroundColor: Colors.GRAY_PRIMARY,
            width: '100%',
            marginTop: 5,
            borderRadius: 12,
          }}
          onSelect={(selectedItem, index) => {
            this.setState({ selectedGender: selectedItem });
          }}
        />

        <TouchableOpacity
          onPress={() => {
            this.setState({ dobModalVisible: true });
          }}
          style={{
            marginVertical: 5,
            backgroundColor: Colors.GRAY_PRIMARY,
            width: '100%',
            borderRadius: 12,
          }}>
          <Text style={{ padding: 13 }}>
            {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
          </Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput placeholder="Email" value={user?.email} editable={false} />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Contact"
            value={this.state.contact}
            onChangeText={text => this.setState({ contact: text })}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            value={this.state.address}
            placeholder={'Address'}
            multiline
            numberOfLines={3}
            onChangeText={text => this.setState({ address: text })}
            // placeholderTextColor={Colors.GRAY_1}
            style={{
              height: 100,
              // backgroundColor: Colors.BLUE_LIGHT,
              textAlignVertical: 'top',
              padding: 10,
              fontSize: 16,
              marginVertical: 5,
              color: Colors.GRAY_5,
            }}
          />
        </View>

        <View style={{ marginVertical: 5, width: '100%' }}>
          <TextInput
            placeholder="Government ID"
            value={this.state.govtId}
            onChangeText={text => this.setState({ govtId: text })}
          />
        </View>


        <View style={{ width: '100%', marginTop: 20 }}>
          {getcolors && getcolors.length > 0 ?
            <SelectDropdown
              data={getcolors}
              dropdownIconPosition="right"
              defaultButtonText={'Select Color'}
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownIcon}
                    style={{ width: 20, tintColor: Colors.GRAY_6 }}
                  />
                );
              }}
              buttonTextStyle={{
                textAlign: 'left',
                color: Colors.GRAY_1,
                fontSize: 16,
              }}
              buttonStyle={{
                // backgroundColor: Colors.BLUE_LIGHT,
                width: '100%',
                marginTop: 5,
              }}
              onSelect={(selectedItem, index) => {
                this.setState({ color_code: this.props.getcolors[index].code });
              }}
            /> : null}
        </View>

        <View style={{ width: '100%', marginTop: 20 }}>
          <Button
            height={50}
            name={'Save'}
            textStyle={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.WHITE,
            }}
            backgroundColor={Colors.BLUE}
            onPress={this.updateProfile}
          />
        </View>
      </View>
    );
  };

  render() {
    let { image } = this.state;
    const { role, user } = this.props;

    // console.warn(moment(this.state.dob).format('MMM DD YYYY'));

    let userProfileImage = image?.uri
      ? image?.uri
      : user?.profile_image
        ? img_url + user?.profile_image
        : dummyImage;

    // console.log('userProfileImage', userProfileImage);
    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })



    return (
      <>
        <View style={styles.container}>
          <Header
            title="Edit Profile"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View
            style={{
              backgroundColor: Colors.GRAY_2,
              borderRadius: 20,
              padding: 10,
              flex: 0.95,
              marginTop: 80,
            }}>
            <View style={{ marginTop: -70, alignItems: 'center' }}>
              <View>
                <Image
                  source={{
                    uri: userProfileImage,
                  }}
                  style={{ width: 130, height: 130, borderRadius: 100 }}
                />

                <TouchableOpacity
                  onPress={this.SelectProfilePicture}
                  style={{
                    position: 'absolute',
                    height: '25%',
                    width: 130,
                    bottom: 0,
                    alignItems: 'center',
                  }}>
                  <FontAwesome
                    name="camera"
                    size={20}
                    color={Colors.BLUE_LIGHT}
                  />
                </TouchableOpacity>
              </View>

              {/* <View style={{marginVertical: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>Johndoe</Text>
              </View> */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {role == 'store'
                ? this.renderStoreEditProfileItems()
                : role == 'facility' || role == 'staff'
                  ? this.renderFacilityEditProfileItems(role)
                  : role == 'parent'
                    ? this.renderParentEditProfile()
                    : role == 'player'
                      ? this.renderPlayerEditProfileItems(role)
                      : role == 'team'
                        ? this.renderTeamProfileEdit(userProfileImage)
                        : role == 'coach'
                          ? this.renderCoachProfileEdit()
                          : null}

              {this.selectUserDob()}
              <Loader loader={this.state.loader} />
            </ScrollView>

            <View style={{ alignItems: 'center' }}>
              <View style={styles.underLine}></View>
            </View>
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    getcolors: state.Auth.Colors,

  };
};
const mapsDispatchToProps = dispatch => {
  return {
    updateProfile: payload =>
      dispatch(AuthMiddleware.updateUserProfile(payload)),
    getColors: () => dispatch(AuthMiddleware.getColors()),

    // checkChildEmail: payload =>
    //   dispatch(AuthMiddleware.checkChildEmail(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
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
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.BLUE,
    width: '20%',
    height: 20,
    position: 'absolute',
    bottom: 0,
  },
  childEmailItemContainer: {
    backgroundColor: Colors.GRAY_2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
});
