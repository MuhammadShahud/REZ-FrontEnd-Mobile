import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
    Modal,
    Dimensions
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Header, Loader, Text } from '../../Components';
import { Colors } from '../../Styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { dummy, Send, attachmentIcon } from '../../Assets';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../Store/Apis';
import Pusher from 'pusher-js/react-native';
import ChatAction from '../../Store/Actions/ChatAction';
import { dummyImage } from '../../Config';
import moment from 'moment';

import { OpenImagePicker } from '../../Config';
import VideoPlayer from 'react-native-video-player';

export class GroupChat extends Component {
    state = {
        message: '',
        loader: false,
        sendMessageLoader: false,
        imgModal: false,
        imagePath: '',
        attachment: false,
        type: ''
    };


    componentDidMount() {
        const chatHead = this.props.route?.params?.chatHead;
        this.props.ReadGroupMessages({ id: chatHead.id });
        this.setState({ loader: true }, () => {
            this.props
                .getGroupMessages({ next_page_url: undefined, id: chatHead.id })
                .then(() =>
                    this.setState({ loader: false }),
                )
                .catch(() => this.setState({ loader: false }));
        });
        this.initiatePusher();
    }
    componentWillUnmount() {
        this.props.resetChat();
        this.chatChannel?.unsubscribe();
    }
    initiatePusher = () => {
        const chatHead = this.props.route?.params?.chatHead;
        this.pusher = new Pusher('811f32a71f3170c28d91', { cluster: 'ap2' });
        this.chatChannel = this.pusher.subscribe(String(chatHead.id));
        this.chatChannel.bind('App\\Events\\MessageSent', data => {
            if (chatHead.id == data.chat.chat_group_id) {
                const chat = {
                    id: data.chat.id,
                    chat_group_id: data.chat.chat_group_id,
                    from_id: data.chat.from_id,
                    content_id: data.chat.content_id,
                    message: data.chat.message,
                    created_at: data.chat.created_at,
                    updated_at: data.chat.updated_at,
                    media: data.chat.media,
                    media_type: data.chat.media_type,
                    sent_from: {
                        username: data.user.username,
                        id: data.chat.from_id,
                        profile_image: data.user.profile_image
                    },
                    post: data.chat.post,
                    shared_from: data.chat.shared_from
                }
                this.props.updateChatMessages(chat);
                this.setState({ sendMessageLoader: false, attachment: false, message: '' })
            }
        });
    };

    sendMessage = () => {
        if (this.state.message) {
            const chatHead = this.props.route?.params?.chatHead;
            this.setState({ sendMessageLoader: true }, () => {
                this.props
                    .sendMessage({
                        Group_id: chatHead.id,
                        message: this.state.message,
                    })
                    .then(() => this.setState({ message: '', sendMessageLoader: false }))
                    .catch(() => this.setState({ sendMessageLoader: false }));
            });
        }
    };

    renderMessages = ({ item }) => {
        console.log(item)
        const { GroupMessages, user } = this.props;
        const chatHead = this.props.route?.params?.chatHead;

        let item_id = item?.sent_from ? item.sent_from.id : item.from_id;

        let avatarImage =
            item_id == user.id
                ? user.profile_image != null
                    ? `${img_url}${user.profile_image}`
                    : dummyImage : item.sent_from.profile_image ?
                    `${img_url}${item.sent_from.profile_image}` : dummyImage;
        return (
            <View
                style={{
                    marginVertical: 12,
                    flexDirection: item_id == user.id ? 'row-reverse' : 'row',
                    alignItems: 'center',
                }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Image
                        source={{ uri: avatarImage ? avatarImage : dummyImage }}
                        style={styles.userImg}
                    />

                </View>

                <View style={{ width: '60%' }}>
                    {item.post == null && item.shared_from == null && item?.media_type == null ?
                        <>
                            <Text
                                style={{
                                    textAlign: item_id == user.id ? 'right' : 'left',
                                    color: Colors.GRAY_3,
                                    fontWeight: 'bold',
                                }}>
                                {item.sent_from.username}
                            </Text>
                            <Text
                                style={{
                                    textAlign: item_id == user.id ? 'right' : 'left',
                                    color: Colors.GRAY_3,
                                }}>
                                {item.message}
                            </Text>
                            <Text
                                style={{
                                    textAlign: item_id == user.id ? 'right' : 'left',
                                    color: Colors.GRAY_3,
                                    fontSize: 12,
                                    marginTop: 5
                                }}>
                                {item.send_date}
                            </Text>
                        </>
                        : item?.media_type == null ?
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.BLUE_LIGHT,
                                    alignSelf: item_id == user.id ? 'flex-end' : 'flex-start',
                                    padding: 10,
                                    borderRadius: 10
                                }}
                                onPress={() =>
                                    this.props.navigation.navigate('Post', { item: item.post })
                                }>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: item?.shared_from?.image != null ? img_url + item.shared_from.image : dummyImage }}
                                        style={styles.userImg}
                                    />
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>{item.shared_from.name}</Text>
                                        <Text style={{ marginLeft: 5 }}>{moment(item.post.created_at).format('MMM DD YYYY')}</Text>
                                    </View>

                                </View>

                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ margin: 5, fontWeight: 'bold' }}>{item.post.title}</Text>
                                    <Image
                                        source={{ uri: item?.post.image != null ? img_url + item.post.image : dummyImage }}
                                        style={{ width: 200, height: 200, borderRadius: 5 }}
                                        resizeMode={'cover'}
                                    />
                                </View>
                                <Text
                                    style={{
                                        textAlign: item_id == user.id ? 'right' : 'left',
                                        color: Colors.GRAY_3,
                                        fontSize: 12,
                                        marginLeft: 5,
                                        marginTop: 5
                                    }}>
                                    {item.send_date}
                                </Text>

                            </TouchableOpacity>
                            : null}

                    {item?.post == null && item?.shared_from == null && item?.media_type == 'image' ?
                        <TouchableOpacity onPress={() => { this.setState({ imgModal: true, imagePath: item?.media, type: item?.media_type }) }} style={{
                            alignSelf: item_id == user.id ? 'flex-end' : 'flex-start',
                            backgroundColor: Colors.BLUE_LIGHT,
                            padding: 10,
                            height: 150,
                            width: 150,
                            borderRadius: 10
                        }}>
                            <Image source={{ uri: img_url + item?.media }} style={{ height: 130, width: 130, borderRadius: 10 }} />
                        </TouchableOpacity>
                        : item?.post == null && item?.shared_from == null && item?.media_type == 'video' ?
                            <View style={{
                                alignSelf: item_id == user.id ? 'flex-end' : 'flex-start',
                                backgroundColor: Colors.BLUE_LIGHT,
                                padding: 10,
                                height: 150,
                                width: 150,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    height: 120,
                                    width: 120,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                }}>
                                    <TouchableOpacity onPress={() => { this.setState({ imgModal: true, imagePath: item?.media, type: item?.media_type }) }}>

                                        <FontAwesome5 name="play-circle" size={34} color={Colors.WHITE} />

                                    </TouchableOpacity>
                                </View>
                            </View>

                            : null}


                </View>
            </View>
        );
    };

    loadMoreMessages = () => {
        const { GroupMessagePaginatedObj } = this.props;
        const { loader } = this.state;
        const chatHead = this.props.route?.params?.chatHead;

        if (GroupMessagePaginatedObj.next_page_url && loader === false) {
            this.setState({ loader: true }, () => {
                this.props
                    .getGroupMessages({
                        next_page_url: GroupMessagePaginatedObj.next_page_url,
                        id: chatHead.id
                    })
                    .then(() => this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }
    };

    uploadImage = () => {
        OpenImagePicker(img => {
            this.createimageObj(img);
        }, false, '', true);
    };

    createimageObj = imgs => {
        let uri_script, name, imgObj;
        uri_script = imgs.path.split('/');
        name = uri_script[uri_script.length - 1];
        imgObj = {
            name,
            uri: imgs.path,
            size: imgs.size,
            type: imgs.mime,
        };
        this.sendAttachment(imgObj)
        // this.setState({ image: imgObj })
    }

    sendAttachment = (img) => {
        const chatHead = this.props.route?.params?.chatHead;
        this.setState({ attachment: true, message: img.name }, () => {
            this.props.sendMessage({
                Group_id: chatHead.id,
                media: img,
                media_type: img.type.includes('video') ? 'video' : 'image'
            }).then(() => this.setState({ attachment: false, message: '' }))
                .catch(() => this.setState({ attachment: false, message: '' }))
        });
    }

    render() {
        const chatHead = this.props.route?.params?.chatHead;
        const { GroupMessages, GroupMessagePaginatedObj } = this.props;
        console.warn("===>", GroupMessagePaginatedObj)
        return (
            <View style={styles.container}>
                <View style={{ paddingHorizontal: 14 }}>
                    <Header
                        navigation={this.props.navigation}
                        title={chatHead.name}
                        isShowLeftIcon={true}
                    />
                </View>
                {this.state.loader ? (
                    <ActivityIndicator size={'large'} color={Colors.GREEN} />
                ) : null}
                <FlatList
                    data={GroupMessages}
                    renderItem={this.renderMessages}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    inverted={GroupMessages?.length > 0 ? true : false}
                    onEndReached={() => this.loadMoreMessages()}
                    onEndReachedThreshold={0.6}
                    ListEmptyComponent={
                        !this.state.loader ?
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingVertical: 40,
                                }}>
                                <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                                    No Chat Found
                                </Text>
                            </View> : null
                    }
                />

                <View style={styles.footer}>
                    <TextInput
                        value={this.state.message}
                        onChangeText={text => this.setState({ message: text })}
                        placeholder="Write a message"
                        placeholderTextColor={Colors.GRAY_1}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        disabled={this.state.attachment}
                        onPress={() => this.uploadImage()}
                        style={{ paddingHorizontal: 10 }}>
                        {this.state.attachment ? (
                            <ActivityIndicator />
                        ) : (
                            <Image source={attachmentIcon} style={{ width: 20, height: 20, tintColor: Colors.BLUE }} resizeMode={'contain'} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={this.state.message ? false : true}
                        onPress={this.sendMessage}
                        style={{ paddingHorizontal: 10 }}>
                        {this.state.sendMessageLoader ? (
                            <ActivityIndicator />
                        ) : (
                            <Image source={Send} style={{ width: 22, height: 22 }} />
                        )}
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.imgModal}
                    onRequestClose={() => this.setState({ imgModal: false })}>
                    <SafeAreaView style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                        <View style={{ width: '95%', height: 400 }}>
                            {this.state.type == 'image' && this.state.imagePath ?
                                <Image
                                    source={{ uri: img_url + this.state.imagePath }}
                                    style={{ width: '100%', height: 300, borderRadius: 10 }}
                                    resizeMode={'contain'}
                                />
                                : this.state.imagePath && this.state.type == 'video' ?
                                    <VideoPlayer
                                        video={{ uri: img_url + this.state.imagePath }}
                                        videoWidth={Dimensions.get('screen').width}
                                        videoHeight={300}
                                        resizeMode={'contain'}
                                        showDuration={true}
                                        style={{ borderRadius: 10 }}
                                    />
                                    : null
                            }

                            <TouchableOpacity style={styles.dismiss} onPress={() => this.setState({ imgModal: false, imagePath: '', type: '' })}>
                                <Text style={{ color: Colors.WHITE }}>Close</Text>
                            </TouchableOpacity>
                        </View>

                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.WHITE },
    input: { flex: 1, paddingLeft: 14, color: Colors.GRAY_3 },
    userImg: { width: 55, height: 55, borderRadius: 100 },
    msgDay: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.BLACK,
        fontSize: 16,
    },
    footer: {
        paddingVertical: 4,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.GRAY_1,
        alignItems: 'center',
    },
    dismiss: {
        alignSelf: 'center',
        marginVertical: 15,
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 10
    }
});

const mapStateToProps = state => {
    return {
        GroupMessages: state.ChatReducer.GroupMessages,
        GroupMessagePaginatedObj: state.ChatReducer.GroupMessagePaginatedObj,
        user: state.Auth.user,
    };
};
const mapsDispatchToProps = dispatch => {
    return {
        getGroupMessages: payload =>
            dispatch(ChatMiddleware.getGroupChatMessages(payload)),
        sendMessage: payload => dispatch(ChatMiddleware.sendGroupMessage(payload)),
        resetChat: () => dispatch(ChatAction.resetChat()),
        updateChatMessages: payload =>
            dispatch(ChatAction.updateGroupChatMessages(payload)),
        ReadGroupMessages: payload =>
            dispatch(ChatMiddleware.readGroupChatMessages(payload)),
    };
};
export default connect(mapStateToProps, mapsDispatchToProps)(GroupChat);
