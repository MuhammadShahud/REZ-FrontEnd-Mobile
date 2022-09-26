import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { redShirt, yellowShirt } from '../../../Assets';
import { Text } from '../../../Components';
import { Colors } from '../../../Styles';
import { connect } from 'react-redux';
import EventMiddleware from '../../../Store/Middleware/EventMiddleware';
import { img_url } from '../../../Store/Apis';

class PreviousEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadmore: false,
      data: [
        // {
        //   description: 'UEFA Champions League',
        //   bgImage: redShirt,
        //   date: "Sep 17' 21",
        // },
      ],
      refreshing: false,
    };
  }
  componentDidMount() {
    this.props.PastEvents({ next_page_url: undefined })

  }
  onRefresh = () => {
    this.props.PastEvents({ next_page_url: undefined })
  };
  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.mv5}
        onPress={() =>
          this.props.navigation.navigate('EventDetails', {
            event_id: item?.id,
            Past: true,
          })
        }>
        <View style={styles.postContainer}>
          <Image
            source={{ uri: img_url + item?.image }}
            resizeMode="cover"
            style={styles.bgImage}
          />
          <View style={styles.postContentContainer}>
            <Text style={styles.postTitle}>{item?.title}</Text>
            <Text style={styles.postDate}>Date: {item?.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { previousEvent } = this.props;
      this.props
        .PastEvents({ next_page_url: previousEvent.next_page_url })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { previousEvent } = this.props;
    const { loadmore } = this.state;
    return previousEvent.next_page_url ? (
      loadmore ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={styles.loadMoreContentContainer}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.previousEvent_list}
          style={styles.pt15}
          ListHeaderComponentStyle={styles.listHeaderContainer}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  color: Colors.black,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Event not found
              </Text>
            </View>
          )}
          ListFooterComponent={this.renderLoaderMoreButton()}

        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  previousEvent: state.EventReducer.previous_event,
  previousEvent_list: state.EventReducer.previousEvent_list

});
const mapDispatchToProps = dispatch => ({
  PastEvents: paylaod => dispatch(EventMiddleware.PastEvents(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviousEvents);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 15,
  },
  listHeaderContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  pt15: {
    paddingTop: 15,
  },
  bgImage: {
    height: 180,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  mv5: {
    marginVertical: 5,
  },
  postContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  postContentContainer: {
    height: 80,
    backgroundColor: Colors.BLUE_LIGHT,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  postTitle: {
    color: Colors.GRAY_3,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  postDate: {
    marginBottom: 10,
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf: 'center'
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
});
