import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {kit, yellowShirt} from '../../Assets';
import {Button} from '../../Components';
import {Colors} from '../../Styles';

class PaymentHistory extends Component {
  renderItems = ({item, index}) => (
    <View style={styles.itemContainer}>
      <View style={styles.imgContainer}>
        <Image source={yellowShirt} style={{width: 55, height: 60}} />
      </View>

      <View style={{flex: 1, paddingHorizontal: 6}}>
        <View style={styles.textContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            Fly Emirates T-Shirt
          </Text>

          <Text style={{fontWeight: 'bold'}}>$12</Text>
        </View>

        <Text style={{fontSize: 12}}>Date : Sep 15' 21 </Text>
        <Text style={{fontSize: 12}}>Recipient : Rez.com</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[{}, {}, {}, {}]}
          renderItem={this.renderItems}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* <TouchableOpacity
          onPress={() => this.props.navigation.navigate('OrderSuccessfull')}
          style={styles.button}>
          <Text style={styles.btnText}>Pay Now</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  itemContainer: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
    padding: 8,
    backgroundColor: Colors.GRAY_PRIMARY,
    flexDirection: 'row',
  },
  imgContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 16,
    marginVertical: 12,
    backgroundColor: Colors.BLUE,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});
export default PaymentHistory;
