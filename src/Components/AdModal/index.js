import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import {Colors} from '../../Styles';
import {close} from '../../Assets';

export default class AdModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible ? props.visible : false,
    };
  }



  
  render() {
    console.log(this.state.visible);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}>
        <View style={{backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  color: Colors.GREEN,
                }}>
                Ad
              </Text>
              <Image
                source={{uri: 'https://dummyimage.com/sqrpop'}}
                style={{height: 300, width: '100%'}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.GRAY_3,
                  paddingHorizontal: 15,
                }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </Text>
              <TouchableOpacity
                style={{position: 'absolute', right: 20, top: 20}}
                onPress={() => this.setState({visible: false})}>
                <Image source={close} style={{width: 15, height: 15}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
