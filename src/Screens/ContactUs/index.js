import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Alert , SafeAreaView} from 'react-native';
import {Header, Text, TextInput} from '../../Components';
import {Colors} from '../../Styles';
import {connect} from 'react-redux';
import GerneralMiddleware from '../../Store/Middleware/GeneralMiddleware';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      description: '',
      refreshing: false,
    };
  }
  handleChangeName = value => {
    this.setState({name: value});
  };
  handleChangeEmail = value => {
    this.setState({email: value});
  };
  handleChangeDescription = value => {
    this.setState({description: value});
  };
  componentDidMount() {
    this.setState({
      name: this.props.user?.username,
      email: this.props.user?.email,
    });
  }
  onSubmit = () => {
    console.warn('Submit Click');
    let {name, email, description} = this.state;
    if (name == '' || email == '' || description == '') {
      Alert.alert('Please fill all fields.. ');
    } else {
      this.props.ContactUs({
        name,
        email,
        description,
        callback: response => {
          if (response) {
            console.warn('RES,', response?.data?.message);
            Alert.alert(response?.data?.message);
            this.setState({
              refreshing: false,
            });
            this.props.navigation.goBack();
          } else {
            this.setState({loading: false, refreshing: false});
          }
        },
      });
    }
  };
  render() {
    const {user} = this.props;
    return (
      <SafeAreaView style={{ flex:1}}>
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          title="Contact Us"
          isShowLeftIcon={true}
        />

        <Text style={styles.title}>Contact Us</Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChangeName}
        />

        <View style={{width: '100%', alignSelf: 'center', marginVertical: 12}}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={user?.email}
            editable={false}
            onChangeText={this.handleChangeEmail}
          />
        </View>

        <TextInput
          placeholder="Type your query here..."
          style={[styles.input, {height: 135, textAlignVertical: 'top'}]}
          value={this.state.description}
          onChangeText={this.handleChangeDescription}
        />

        <TouchableOpacity onPress={() => this.onSubmit()} style={styles.button}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE, paddingHorizontal: 25},
  title: {
    marginVertical: 28,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  input: {
    width: '100%',
    paddingLeft: 12,
    alignSelf: 'center',
    backgroundColor: Colors.GRAY_PRIMARY,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    marginVertical: 20,
    backgroundColor: Colors.BLUE,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});

const mapStateToProps = state => ({
  user: state.Auth.user,
});
const mapDispatchToProps = dispatch => ({
  ContactUs: paylaod => dispatch(GerneralMiddleware.ContactUs(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);
