import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Header, Text} from '../../Components';
import {Colors} from '../../Styles';
import {connect} from 'react-redux';
import GerneralMiddleware from '../../Store/Middleware/GeneralMiddleware';
import RenderHtml from 'react-native-render-html';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.setState({
      refreshing: true,
    });
    this.Terms();
  }

  Terms = () => {
    this.props.Terms({
      callback: response => {
        if (response) {
          console.warn('RES,', response);
          this.setState({
            data: response?.data?.data,
            refreshing: false,
          });
        } else {
          this.setState({loading: false, refreshing: false});
        }
      },
    });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Terms and Conditions"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 20}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                Terms of Service
              </Text>

              <RenderHtml
                contentWidth={'100%'}
                source={{html: this.state.data}}
              />
            </View>

            {/* <View style={{ marginVertical: 5 }}>
              <Button
                name="Accept"
                backgroundColor={Colors.BLUE}
                textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
              />
            </View>

            <View style={{ marginVertical: 5 }}>
              <Button
                name="Decline"
                backgroundColor={Colors.GREEN}
                textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
              />
            </View> */}
          </ScrollView>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  Terms: paylaod => dispatch(GerneralMiddleware.Terms(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

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
  closeImage: {width: 60, height: 20},
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.BLUE,
    width: '20%',
    height: 20,
    position: 'absolute',
    bottom: -10,
  },
});
