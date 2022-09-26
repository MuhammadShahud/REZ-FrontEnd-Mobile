import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  calendar_gray,
  check_blue,
  close,
  dropdownGreyIcon,
  dropdownIcon,
  person_plus,
  upload,
} from '../../../Assets';
import {Button, Header, Loader, Text, TextInput} from '../../../Components';
import {Colors} from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import UserAction from '../../../Store/Actions/UserAction';
import {connect} from 'react-redux';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';

export class UploadLeagueStats extends Component {
  state = {
    // registerAs: ['Premier League', 'Clinic', 'Training', 'Event'],
    teamOneScore: '',
    teamTwoScore: '',
    loading: false,
  };

  componentDidMount() {
    this.sheetRef.snapTo(1);
  }

  renderContent = () => {
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.sheetRef.snapTo(1);
            this.props.navigation.goBack();
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
          <Text style={styles.sheetHeading}>Your stats has been updated</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };

  updateLeagueStatus = () => {
    let {teamOneScore, teamTwoScore} = this.state;
    let {item} = this.props.route.params;
    console.warn(item)
    if (!teamOneScore || !teamTwoScore) {
      alert('Please enter score of teams!');
    } else {
      this.setState({loading: true});
      this.props
        .updateLeagueScore({
          teamOneId: item.team[0]?.team_id,
          teamTwoId: item.team[1]?.team_id,
          league_id: item.id,
          teamOneScore: this.state.teamOneScore,
          teamTwoScore: this.state.teamTwoScore,
        })
        .then(data => {
          if (data) {
            let leagueDetailCopy = {...item};
            leagueDetailCopy.team[0].team1_score = this.state.teamOneScore;
            leagueDetailCopy.team[1].team2_score = this.state.teamTwoScore;

            this.setState({loading: false});
            this.props.updateLeagueDetail(leagueDetailCopy);
            this.sheetRef.snapTo(0);
          } else {
            this.setState({loading: false});
          }
        });

      return;
    }
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            title={'Upload League Status'}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title of League</Text>
              <SelectDropdown
                data={this.state.registerAs}
                defaultValue={this.state.registerAs[0]}
                dropdownIconPosition="right"
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownGreyIcon}
                      style={styles.w20}
                    />
                  );
                }}
                buttonTextStyle={styles.dropDownBtnText}
                buttonStyle={styles.btnStyle}
                onSelect={(selectedItem, index) => {
                  this.setState({registeredAs: selectedItem});
                }}
              />
            </View> */}
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                multiline={true}
                placeholder={'Description here'}
                style={styles.inputDescription}
              />
            </View> */}

            {/* <View style={styles.flexRow}>
              <View style={[styles.inputTime, styles.marginRight5]}>
                <Text style={styles.inputLabel}>Name of Team 1</Text>
                <TextInput placeholder={'Soccer Club 1'} />
              </View>
              <View style={[styles.inputTime, styles.marginLeft5]}>
                <Text style={styles.inputLabel}>Name of Team 2</Text>
                <TextInput placeholder={'Soccer Club 2'} />
              </View>
            </View> */}

            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity>
                <TextInput
                  editable={false}
                  placeholder={'Select Date'}
                  endIcon={calendar_gray}
                />
              </TouchableOpacity>
            </View> */}

            {/* <View style={styles.flexRow}>
              <View style={[styles.inputTime, styles.marginRight5]}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput placeholder={'Start Time'} />
              </View>
              <View style={[styles.inputTime, styles.marginLeft5]}>
                <Text style={styles.inputLabel}></Text>
                <TextInput placeholder={'End Time'} />
              </View>
            </View> */}

            {/*             
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput placeholder={'Enter Location'} />
            </View> */}

            <View style={styles.flexRow}>
              <View style={[styles.inputTime, styles.marginRight5]}>
                <Text style={styles.inputLabel}>Score of Team 1</Text>
                <TextInput
                  placeholder={'Enter Score'}
                  value={this.state.teamOneScore}
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({teamOneScore: text})}
                />
              </View>

              <View style={[styles.inputTime, styles.marginLeft5]}>
                <Text style={styles.inputLabel}>Score of Team 2</Text>
                <TextInput
                  placeholder={'Enter Score'}
                  value={this.state.teamTwoScore}
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({teamTwoScore: text})}
                />
              </View>
            </View>

            {/* */}

            <Button
              onPress={this.updateLeagueStatus}
              btnStyle={styles.mv20}
              name={'Update Scores'}
              backgroundColor={Colors.BLUE}
              textStyle={styles.cWhite}
            />
          </ScrollView>
        </View>

        <Loader loader={this.state.loading} />

        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[280, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  updateLeagueScore: payload => dispatch(UserMiddleware.updateScore(payload)),
  updateLeagueDetail: payload =>
    dispatch(UserAction.saveLeagueDetails(payload)),
});

export default connect(null, mapDispatchToProps)(UploadLeagueStats);

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
